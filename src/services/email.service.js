const nodemailer = require('nodemailer');

const {email: {user, password: pass}, webUrl} = require('../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user,
        pass
    }
}, {
    
});


const sendEmail = async (to, subject, text, html) => {
    try {
        await transporter.sendMail({
            from: "Action Hive <noreply@actionhive.co>",
            to,
            subject,
            text,
            html
        });
        return { status: 200, message: 'Email sent' };
    } catch (error) {
        return { status: 500, message: error.message };
    }
}


const sendForgotEmail = async (to, token) => {
    const subject = 'Reset password';
    const text = `Reset password token: ${token}`;
    const html = `<p>Puedes restablecer tu contraseña en este <a href="${webUrl}/forgot-password?token=${token}">LINK</a></p>`;
    return await sendEmail(to, subject, text, html); 
}

module.exports = { sendEmail, sendForgotEmail };