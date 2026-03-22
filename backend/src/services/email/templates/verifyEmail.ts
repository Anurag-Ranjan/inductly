export const verifyEmailTemplate = (name: string, link: string) => {
    return `
    <h2>Hello ${name}</h2>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${link}">Verify Email</a>
  `;
};
