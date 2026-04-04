import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/dateFilter.js";
import XLSX from "xlsx";
import nodemailer from "nodemailer";

//add expense 
export async function addExpense(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;
    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const newExpense = new expenseModel({
            userId,
            description,
            amount: Number(amount),
            category,
            date: new Date(date)
        });
        await newExpense.save()
        res.json({
            success: true,
            message: "Expense added succesfully",
            data: newExpense
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succes: false,
            message: "Server Error"
        })
    }
}

//to all expense 
export async function getAllExpense(req,res){
      const userId = req.user._id;
    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1 });
        res.json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succes: false,
            message: "Server Error"
        })
    }
}

//update perticular function
export async function updateExpense(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;
    try {
        const updateExpense = await expenseModel.findOneAndUpdate(
          { _id: id, userId },
          {
            description,
            amount: Number(amount),
            category,
            date,
          },
          { new: true },
        );
        if (!updateExpense) {
            return res.status(404).json({
                succes: false,
                message: "Expense not found"
            })
        }
        res.json({
            success: true, message: "Expense update succesfully.", data: updateExpense
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succes: false,
            message: "Server Error"
        })
    }

}

//delete an expense 
export async function deleteExpense(req, res) {
    const userId = req.user._id;

    try {
        const expense = await expenseModel.findOneAndDelete({ _id: req.params.id, userId });
        if (!expense) {
            return res.status(404).json({
                succes: false,
                message: "expense not found"
            })
        }
        res.json({
            success: true,
            message: "expense deleted succesfully."
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succes: false,
            message: "Server Error"
        })
    }
}

//to download the data in an excel sheet

export async function downloadExpenseExcel(req, res) {
    const userId = req.user._id;
    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1 });
        const plainData = expense.map((exp) => ({
            Description: exp.description,
            Amount: exp.amount,
            Category: exp.category,
            Date: new Date(exp.date).toLocaleDateString(),
        }));
        const worksheet = XLSX.utils.json_to_worksheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="expense_details.xlsx"',
        );
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        res.send(buffer);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succes: false,
            message: "Server Error"
        })
    }
}

function buildExpenseExportRows(expense, range) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const grouped = [];

    if (range === "daily") {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const dayTotals = Array.from({ length: daysInMonth }, (_, i) => ({ period: String(i + 1), expense: 0 }));
        expense.forEach((exp) => {
            const date = new Date(exp.date);
            if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
                dayTotals[date.getDate() - 1].expense += exp.amount;
            }
        });
        return dayTotals.map((item) => ({ Period: `Day ${item.period}`, Expense: item.expense }));
    }

    if (range === "weekly") {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const weeks = Array.from({ length: 12 }, (_, index) => {
            const start = new Date(startOfWeek);
            start.setDate(start.getDate() - (11 - index) * 7);
            const label = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
            return { start, end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6), label, expense: 0 };
        });

        expense.forEach((exp) => {
            const date = new Date(exp.date);
            for (const week of weeks) {
                if (date >= week.start && date <= week.end) {
                    week.expense += exp.amount;
                    break;
                }
            }
        });

        return weeks.map((week) => ({ Period: `Week of ${week.label}`, Expense: week.expense }));
    }

    if (range === "yearly") {
        const yearTotals = {};
        expense.forEach((exp) => {
            const year = new Date(exp.date).getFullYear();
            yearTotals[year] = (yearTotals[year] || 0) + exp.amount;
        });
        return Object.keys(yearTotals)
            .sort((a, b) => Number(a) - Number(b))
            .map((year) => ({ Period: year, Expense: yearTotals[year] }));
    }

    const monthTotals = Array.from({ length: 12 }, (_, i) => ({ period: new Date(currentYear, i, 1).toLocaleString("en-US", { month: "short" }), expense: 0 }));
    expense.forEach((exp) => {
        const date = new Date(exp.date);
        if (date.getFullYear() === currentYear) {
            monthTotals[date.getMonth()].expense += exp.amount;
        }
    });
    return monthTotals.map((item) => ({ Period: item.period, Expense: item.expense }));
}

export async function sendExpenseExportEmail(req, res) {
    const userId = req.user._id;
    const userEmail = req.user.email;
    const range = (req.body.range || "monthly").toLowerCase();

    if (!userEmail) {
        return res.status(400).json({ success: false, message: "User email not found" });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const fromEmail = process.env.FROM_EMAIL || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
        return res.status(501).json({ success: false, message: "SMTP configuration is missing." });
    }

    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1 });
        const rows = buildExpenseExportRows(expense, range);
        const worksheet = XLSX.utils.json_to_worksheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "expense_export");
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

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
            to: userEmail,
            subject: `Expense export (${range})`,
            text: `Your expense report for ${range} mode has been generated and attached.`,
            attachments: [
                {
                    filename: `expense_export_${range}.xlsx`,
                    content: buffer,
                    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                },
            ],
        });

        res.json({ success: true, message: "Expense report sent to your email." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ succes: false, message: "Failed to send expense export email." });
    }
}

// to get expense overview
export async function getExpenseOverview(req,res){
try {
    const userId = req.user._id;
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);

    const expense = await expenseModel.find({
        userId,
        date: { $gte: start, $lte: end },
    }).sort({ date: -1 })

 const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expense.length > 0 ? totalExpense / expense.length : 0;
    const numberOfTransactions = expense.length;
    const recentTransactions = expense.slice(0, 5);
    res.json({
        success:true,
        data:{
            totalExpense,
            averageExpense,
            numberOfTransactions,
            recentTransactions,
            range
        }
    })
} catch (error) {
console.log(error);
        res.status(500).json({
            succes: false,
            message: "Server Error"
        })
}
}
