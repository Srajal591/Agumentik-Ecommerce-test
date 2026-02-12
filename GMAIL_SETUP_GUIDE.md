# Gmail SMTP Setup Guide (Free)

## Quick Setup (5 Minutes)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click on "2-Step Verification"
4. Follow the prompts to enable it (you'll need your phone)

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
   - Or search "App passwords" in Google Account settings
2. You might need to sign in again
3. Under "Select app", choose "Mail"
4. Under "Select device", choose "Other (Custom name)"
5. Type: **Fashion Store Backend**
6. Click "Generate"
7. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Update Backend .env File

Open `backend/.env` and update these lines:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Real Example:**
```env
EMAIL_USER=fashionstore2024@gmail.com
EMAIL_PASSWORD=xyzw abcd efgh ijkl
```

**Important:**
- Use the **App Password**, NOT your regular Gmail password
- Remove spaces from the app password (or keep them, both work)
- Use your actual Gmail address

### Step 4: Restart Backend

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: 127.0.0.1
```

## Testing Email OTP

### Method 1: Using Postman/Thunder Client

**1. Register a User:**
```
POST http://localhost:5000/api/auth/user/register
Body (JSON):
{
  "name": "Test User",
  "email": "your_test_email@gmail.com",
  "mobile": "9876543210"
}
```

You should receive a **welcome email**!

**2. Send Email OTP:**
```
POST http://localhost:5000/api/auth/user/send-email-otp
Body (JSON):
{
  "email": "your_test_email@gmail.com"
}
```

Check your email for the **OTP code**!

**3. Verify OTP:**
```
POST http://localhost:5000/api/auth/user/verify-email-otp
Body (JSON):
{
  "email": "your_test_email@gmail.com",
  "otp": "123456"
}
```

### Method 2: Using Mobile App

1. Start the user frontend:
   ```bash
   cd user-frontend
   npm start
   ```

2. Open in emulator/device

3. Tap "Get Started"

4. Fill registration form with your email

5. Check your email for welcome message!

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution:** You're using your regular Gmail password instead of App Password.
- Generate a new App Password (Step 2 above)
- Use the 16-character code

### Error: "Less secure app access"

**Solution:** This is old. Google now requires App Passwords.
- Make sure 2FA is enabled
- Generate App Password
- Don't use "Less secure apps" setting

### Error: "Daily sending quota exceeded"

**Solution:** Gmail free tier has limits:
- **500 emails/day** for free Gmail
- **2000 emails/day** for Google Workspace
- Wait 24 hours or upgrade to Google Workspace

### Emails going to Spam

**Solution:**
1. Add your email to contacts
2. Mark first email as "Not Spam"
3. For production, use dedicated email service (SendGrid, AWS SES)

### Error: "Connection timeout"

**Solution:**
- Check your internet connection
- Make sure Gmail SMTP is not blocked by firewall
- Try different network (mobile hotspot)

## Email Limits

### Free Gmail Account
- **500 emails per day**
- **500 recipients per email**
- Perfect for development and testing

### Google Workspace
- **2000 emails per day**
- Better for production
- Costs $6/user/month

### Recommendations
- **Development**: Free Gmail is perfect
- **Production**: Use SendGrid (100 emails/day free) or AWS SES

## Alternative Email Services

If you need more emails or better deliverability:

### SendGrid (Recommended for Production)
- **100 emails/day FREE forever**
- Better deliverability
- Analytics dashboard
- Sign up: https://sendgrid.com

### AWS SES
- **62,000 emails/month FREE** (first year)
- $0.10 per 1000 emails after
- Requires AWS account
- Best for high volume

### Mailgun
- **5,000 emails/month FREE** (first 3 months)
- $35/month after
- Good deliverability

## Security Best Practices

1. **Never commit .env file** to Git
   - Already in `.gitignore`
   - Use environment variables in production

2. **Use different email for production**
   - Don't use personal Gmail
   - Create dedicated account

3. **Rotate App Passwords regularly**
   - Every 3-6 months
   - If compromised, revoke immediately

4. **Monitor usage**
   - Check Gmail sent folder
   - Watch for unusual activity

## Production Checklist

Before going live:

- [ ] Use dedicated email account
- [ ] Consider paid email service (SendGrid/AWS SES)
- [ ] Remove OTP from development responses
- [ ] Add email rate limiting per user
- [ ] Set up email monitoring
- [ ] Add email templates for all scenarios
- [ ] Test email deliverability
- [ ] Set up SPF/DKIM records (for custom domain)

## Quick Reference

**Gmail SMTP Settings:**
- Host: `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)
- Security: TLS/SSL
- Authentication: Yes

**App Password Location:**
https://myaccount.google.com/apppasswords

**2FA Settings:**
https://myaccount.google.com/security

**Gmail Limits:**
https://support.google.com/mail/answer/22839

## Need Help?

1. **Gmail Help**: https://support.google.com/mail
2. **Nodemailer Docs**: https://nodemailer.com
3. **Our Documentation**: See `AUTH_COMPLETE.md`

---

**Your email OTP system is ready!** 🎉

Just add your Gmail credentials and start sending beautiful OTP emails!
