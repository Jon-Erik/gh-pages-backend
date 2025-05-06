const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const { 
    GOOGLE_USER_EMAIL, 
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_REDIRECT_URI
} = process.env

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })

async function sendContactFormData({firstName, lastName, email, message}) {
    try {
        if (!firstName || !lastName || !email || !message) {
            throw new Error(`Incomplete contact form submission data: ${JSON.stringify({firstName, lastName, email, message})}`)
        }

        const html = `
            <div>
                <h2>Contact form submission</h2>
                <p>First Name: ${firstName}</p>
                <p>Last Name: ${lastName}</p>
                <p>Email: ${email}</p>
                <p>Message: ${message}</p>
            </div>
        `
        const subject = `Contact form submission (jon-erik.github.io) from ${firstName} ${lastName}`
        
        const response = await sendEmail({ html, subject })

        if (response.success) {
            return { success: true, msg: `${response.msg}: contact form submitted successfully.` }
        } else {
            throw new Error(response.msg)
        }
    } catch (e) {
        console.log("sendContactFormData error:", e.message)
        return {success: false, msg: e.message}
    }
}

async function sendEmail({ 
    html, 
    subject = "(no subject)", 
    to = GOOGLE_USER_EMAIL,
    from = `Gmail OAuth2 Client <${GOOGLE_USER_EMAIL}>`
}) {
    try {
        const accessToken = await oauth2Client.getAccessToken()

        const transportOpts = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: GOOGLE_USER_EMAIL,
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken
            }
        }

        const transport = nodemailer.createTransport(transportOpts);

        const response = await transport.sendMail({ to, from, subject, html })

        if (response.response.includes('OK')) {
            return {success: true, msg: "Email sent"}
        } else {
            throw new Error(response.msg)
        }   
    } catch (e) {
        console.log("sendEmail error:", e.message)
        return {success: false, msg: e.message}
    }
}

module.exports = {
    sendContactFormData,
}
