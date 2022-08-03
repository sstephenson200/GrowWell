const nodemailer = require("nodemailer");

async function nodemailer(email, password) {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASS
        }
    });

    let info = await transporter.sendMail({
        from: '"Grow Well: Garden Manager" < passwordReset@growWell.com >',
        to: email,
        subject: "Password Reset",
        text: "Your new password is: " + password + ".\nPlease reset your password as soon as possible!"
    });
}

export default nodemailer;