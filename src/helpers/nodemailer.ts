import config from 'config'
import nodemailer from 'nodemailer';

const mail: any = config.get("nodeMail");

const option = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: mail.mail,
        pass: mail.password
    }
}

const transPorter = nodemailer.createTransport(option)

export const forgot_password_mail = (user, otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            const mailOptions = {
                from: mail.mail, // sender address
                to: user.email, // list of receivers
                subject: "Passport Pals  forgotten password reset",
                html: `<html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Verification Email Template</title>
                    <meta name="description" content="Reset Password Email Template.">
                    <style type="text/css">
                        a:hover {text-decoration: underline !important;}
                    </style>
                </head>
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#22437d; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <h1 style="color:#000000; font: weight 500px;; margin:0;font-size:30px;font-family:'Rubik',sans-serif;"><img src="https://res.cloudinary.com/duodtfccq/image/upload/v1689166976/profile_image/ihybwht9b6tjgewsedyp.png" alt="logo"  style=" width: 200px;margin-bottom: 20px; font-size:80px;font-family:'Rubik'"> <br> Forgot Password</h1>
                                                        <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #a5aac4d5; width:100px;"></span>
                                                        <p style="color:#c4cbeed5; font-size:15px;line-height:24px; margin:0;">
                                                            Hi ${user.name}
                                                            <br>
                                                            Someone, hopefully you, has requested to reset the password for your Passport Pals
                                                            <br>
                                                            account.
                                                            <br>
                                                            OTP will expire in 10 minutes.
                                                            <br>
                                                            Verification code: ${otp}
                                                            <br>
                                                            <br>
                                                            Thanks,
                                                            <br>
                                                            Passport Pals
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                        <tr>
                                            <td style="height:20px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;"><strong>www.PassportPals.com</strong></p></td>
                                        </tr>
                                        <tr>
                                            <td style="height:80px;">&nbsp;</td>
                                        </tr>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>`, // html body
            };
            await transPorter.sendMail(mailOptions, function (err, data1) {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
                }
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}