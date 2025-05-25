import { sendEmail } from "./sendEmail.js";
import { generateVerificationOtpEmailTemplate } from "./emailTemplate.js";


export async function sendVerificationCode(verificationCode, email, res) {
  try {
    const message = generateVerificationOtpEmailTemplate(verificationCode);
    sendEmail({
      email,
      subject: "Verification Code (OTP) for NewLibrary",
      message,
    });
    res.status(200).json({
      success: true,
      message: "verification code sent successfully",
    });
} catch (error) {
    return res.status(500).json({
      success: false,
      message: "verification code failed to send",
    });
}
}