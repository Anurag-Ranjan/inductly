import { transporter } from '../../configurations/smtp';

export const sendEmail = async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
        from: `"Inductly" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
    });
};
