const express = require('express')
const router = express.Router()
const { validateRecaptcha } = require('../services/recaptcha')
const { sendContactFormData } = require('../services/sendgrid')
const e = require('express')

router.post('/submit-contact-form', async (req, res) => {
    try {
        //console.log(req.body)
        const { captchaToken, formData } = req.body
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