const express = require('express')
const router = express.Router()
const { validateRecaptcha } = require('../services/recaptcha')
const { sendContactFormData } = require('../services/sendgrid')
const e = require('express')

router.post('/submit-contact-form', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body) > 1) {
            throw new Error("'captchaToken' and 'formData' string must be included in the request body.")
        }
        const { captchaToken, formData } = req.body

        if (!captchaToken) {
            throw new Error("'captchaToken' string must be included in the request body.")
        }
        if (!formData) {
            throw new Error("'formData' object must be included in the request body.")
        }

        const valid = await validateRecaptcha(captchaToken)
    
        if (valid) {
            const { success, msg } = await sendContactFormData(formData)
            if (success) {
                res.status(200).send({ msg, success })
            } else {
                res.status(401).send({ msg, success })
            }
        } else {
            res.status(403).send({ msg: 'Invalid captcha token.', success: false})
        }
    } catch (e) {
        res.status(401).send({ msg: `Server error: ${e.message}`, success: false})
    }
})

module.exports = router