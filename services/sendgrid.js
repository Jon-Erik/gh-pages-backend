const sgMail = require('@sendgrid/mail')
const { 
    SENDGRID_EMAIL, 
    SENDGRID_API_KEY 
} = process.env

sgMail.setApiKey(SENDGRID_API_KEY)

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

        const { msg, success } = await sendEmail({ html, subject });

        if (!success) {
            throw new Error(msg)
        }
        
        return {success: true, msg: `${msg}: contact form submitted successfully.`}
    } catch (e) {
        console.log(JSON.stringify(e))
        return {success: false, msg: e.message}
    }
}

async function sendEmail({ html, subject = "(no subject)" }) {
    try {
        const email = {
            to: SENDGRID_EMAIL, 
            from: "jonerik.chandler@gmail.com",
            subject,
            html,
        }

        const response = await sgMail.send(email)
        return {success: true, msg: "Email sent"}
    } catch (e) {
        console.log(JSON.stringify(e))
        return {success: false, msg: e.message}
    }
}

module.exports = {
    sendContactFormData,
}
