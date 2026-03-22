import { sendEmail } from './sendMail';
import { verifyEmailTemplate } from './templates/verifyEmail';

export const sendVerificationEmail = async (
    email: string,
    name: string,
    link: string
) => {
    const html = verifyEmailTemplate(name, link);

    await sendEmail(email, 'Verify your email', html);
};
