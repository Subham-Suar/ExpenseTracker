import User from '../models/userModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || '24h';
const RESET_TOKEN_TTL_MS = 1000 * 60 * 20;

const createToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
}

const getSmtpConfig = () => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const fromEmail = process.env.FROM_EMAIL || smtpUser;

    return { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, fromEmail };
};

const getFrontendBaseUrl = () => {
    if (process.env.FRONTEND_APP_URL) return process.env.FRONTEND_APP_URL.trim();
    if (process.env.FRONTEND_PUBLIC_URL) return process.env.FRONTEND_PUBLIC_URL.trim();

    const configuredOrigins = (process.env.FRONTEND_URL || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    const httpsOrigin = configuredOrigins.find((origin) => origin.startsWith("https://"));
    return httpsOrigin || configuredOrigins[0] || "http://localhost:5173";
};

export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email"
        })
    }
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters"
        })
    }
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashed })
        const token = createToken(user._id)
        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }  
}

//to login a user 

export async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Both fields are required."
        })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const token = createToken(user._id)
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }
}

// to get login user details

export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user.id).select("name email")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        res.json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Server Error"
        })
    }
}

//to update user profile
 
export async function updateProfile(req,res){
    const {name ,email} = req.body;
    if(!name || !email || !validator.isEmail(email)){
        return res.status(400).json({
            success:false,
            message:"Valid email and name required"
        })
    }
    try {
        const exist = await User.findOne({email,_id:{$ne:req.user.id}})
        if(exist){
            return res.status(409).json({
                success:false,
                message:"Email already in use"
            });
        }
        const user = await User.findByIdAndUpdate(
          req.user.id,
          { name, email },
          { new: true, runValidators: true },
        ).select("name email");
        res.json({
            success:true,
            user
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Server Error"
        })
    }
    
}

//to change password

export async function updatePassword(req,res){
    const{currentPassword ,newPassword}= req.body;
    if(!currentPassword || !newPassword || newPassword.length < 8){
        return res.status(400).json({
            success:false,
            message:"password invalid or too short."
        })
    }
    try {
       const user = await User.findById(req.user.id).select("password");
       if(!user){
        return res.status(400).json({
            success:false,
            message:"User not found."
        })
       }
       const match = await bcrypt.compare(currentPassword ,user.password);
       if(!match){
        return res.status(401).json({
            success:false,
            message:"Current password is incorrect."
        })
       }
       user.password = await bcrypt.hash(newPassword,10);
       await user.save();
       res.json({
        success:true,
        message:"Password changeded"
       })
    } catch (error) {
         console.log(error);
        res.status(404).json({
            success: false,
            message: "Server Error"
        })
    }
}

export async function requestPasswordReset(req, res) {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "A valid email address is required."
        });
    }

    const { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, fromEmail } = getSmtpConfig();
    if (!smtpHost || !smtpUser || !smtpPass) {
        return res.status(501).json({
            success: false,
            message: "Password reset email is not configured yet."
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: true,
                message: "If an account with that email exists, a reset link has been sent."
            });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = expiresAt;
        await user.save();

        const resetLink = `${getFrontendBaseUrl().replace(/\/$/, "")}/reset-password?token=${rawToken}`;
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        await transporter.sendMail({
            from: fromEmail,
            to: user.email,
            subject: "Reset your Expense Tracker password",
            text: `Use this link to reset your password: ${resetLink}. This link expires in 20 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
                    <h2>Reset your password</h2>
                    <p>We received a request to reset your Expense Tracker password.</p>
                    <p>
                        <a href="${resetLink}" style="display:inline-block;padding:12px 20px;background:#14b8a6;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;">
                            Reset Password
                        </a>
                    </p>
                    <p>If the button does not work, copy and paste this link into your browser:</p>
                    <p>${resetLink}</p>
                    <p>This link expires in 20 minutes.</p>
                </div>
            `,
        });

        res.json({
            success: true,
            message: "If an account with that email exists, a reset link has been sent."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Unable to send reset email right now."
        });
    }
}

export async function resetPasswordWithToken(req, res) {
    const { token, password } = req.body;

    if (!token || !password || password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "A valid reset token and password are required."
        });
    }

    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "This reset link is invalid or has expired."
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        res.json({
            success: true,
            message: "Password reset successful. You can now sign in."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Unable to reset password right now."
        });
    }
}
