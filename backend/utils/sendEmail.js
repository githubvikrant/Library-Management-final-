export const sendEmail = async ({ email, subject, message }) => {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            sender: {
                name: "NewLibrary",
                email: process.env.SMTP_MAIL,
            },
            to: [{ email }],
            subject,
            htmlContent: message,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Brevo API error: ${error.message}`);
    }
};