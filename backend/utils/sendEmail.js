import nodemailer from 'nodemailer';

export const sendEmail = async ({email, subject, message}) => {
    // FALLBACK FOR RENDER FREE TIER:
    // Render blocks all outgoing SMTP ports on their free tier.
    // To ensure you can still test OTPs and password resets, we log the email content directly to your Render server logs!
    console.log(`\n========== EMAIL INTERCEPTED ==========`);
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message/Link/OTP: \n${message}`);
    console.log(`=======================================\n`);

    const transporter = nodemailer.createTransport({
        service: "gmail", // Uses built-in nodemailer settings for Gmail (ignores host/port/secure)
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from : process.env.SMTP_MAIL,
        to: email,
        subject,
        html: message
    }

    // Try to send it, but if it fails (due to Render's free tier SMTP block), don't crash the server.
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${email}`);
    } catch (error) {
        console.error(`Render blocked the SMTP connection! Please check the intercepted message above to continue testing. Error: ${error.message}`);
        // We do NOT throw the error here, so the app continues to function and the user can proceed with the OTP from the logs!
    }
}