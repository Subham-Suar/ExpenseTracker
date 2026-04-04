# OAuth Setup Guide

This guide explains how to set up Google and Facebook OAuth authentication for the ExpenseTracker application.

## Prerequisites

- Node.js and npm installed
- Google and Facebook developer accounts

---

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name (e.g., "ExpenseTracker") and click "Create"
4. Wait for the project to be created

### Step 2: Enable Google+ API

1. In the Google Cloud Console, search for "Google+ API"
2. Click on "Google+ API" and then "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "OAuth Client ID"
3. Select "Web application"
4. Under "Authorized JavaScript origins", add:
   - `http://localhost:5173` (or your dev server port)
   - `http://localhost:3000`
   - Your production domain
5. Under "Authorized redirect URIs", add:
   - `http://localhost:5173`
   - `http://localhost:3000`
   - Your production domain
6. Click "Create"
7. Copy the "Client ID" from the dialog

### Step 4: Add to .env

Add the Google Client ID to your `.env` file:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## Facebook OAuth Setup

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Consumer" as the app type
4. Fill in the app name and contact email
5. Click "Create App"

### Step 2: Add Facebook Login Product

1. In your app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Add"
3. Choose "Web" as the platform

### Step 3: Configure Facebook Login Settings

1. Go to "Settings" → "Basic" and copy the App ID
2. In "Products" → "Facebook Login" → "Settings":
   - Under "Valid OAuth Redirect URIs", add:
     - `http://localhost:5173`
     - `http://localhost:3000`
     - Your production domain
3. Go to "Roles" → "Test Users" and create a test user (optional, for testing)

### Step 4: Add to .env

Add the Facebook App ID to your `.env` file:

```
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
```

---

## Backend Integration

Your backend needs to handle OAuth verification. Add these endpoints:

### Google OAuth Endpoint

```
POST /api/auth/google
Body: { token: "google_id_token" }
Response: { token: "jwt_token", user: { id, email, name } }
```

### Facebook OAuth Endpoint

```
POST /api/auth/facebook
Body: { 
  accessToken: "facebook_token", 
  userID: "user_id",
  name: "user_name",
  email: "user_email"
}
Response: { token: "jwt_token", user: { id, email, name } }
```

---

## Testing

1. Update your `.env` file with the OAuth credentials
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Navigate to the login page
4. Click "Google" or "Facebook" buttons to test OAuth flows

---

## Environment Variables

Create a `.env` file in the frontend directory with:

```
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_FACEBOOK_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000
```

---

## Troubleshooting

### Google OAuth Issues

- **"Client ID not configured"**: Make sure `VITE_GOOGLE_CLIENT_ID` is in `.env`
- **CORS errors**: Add localhost and your domain to authorized URIs in Google Cloud Console
- **Invalid grant**: OAuth token validation failed on backend

### Facebook OAuth Issues

- **"App ID not configured"**: Make sure `VITE_FACEBOOK_APP_ID` is in `.env`
- **Redirect URI mismatch**: Ensure URIs match exactly in Facebook app settings
- **Access token validation**: Ensure your backend validates tokens with Facebook API

---

## Production Deployment

For production:

1. Create production OAuth apps (don't use development apps)
2. Add your production domain to both Google and Facebook settings
3. Update `.env` with production credentials
4. Use HTTPS only
5. Set secure cookies if applicable

---

For more help, check:
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Facebook OAuth Documentation](https://developers.facebook.com/docs/facebook-login)
