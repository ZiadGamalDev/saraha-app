import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
        user: "lisette.schneider14@ethereal.email",
        pass: "pWPDsBkZ6ggdGpMtue",
    },
});

export const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: "lisette.schneider14@ethereal.email",
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};
