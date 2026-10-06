export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
    return `
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="margin-bottom: 20px;">Password Reset Request</h2>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <a href="${resetPasswordUrl}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p style="margin-top: 20px;">If you did not request a password reset, please ignore this email.</p>
                <p style="margin-top: 20px;">${resetPasswordUrl}</p>
                <div style="margin-top: 30px; font-size: 12px; color: #777;">
                    <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `
}
