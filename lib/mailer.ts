import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendConfirmationEmail = async (to: string, name: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: '🎉 Thanks for subscribing!',
    html: `<h2>Hi ${name},</h2>
           <p>Thanks for subscribing to our newsletter. Stay tuned for updates!</p>`,
  });
};
