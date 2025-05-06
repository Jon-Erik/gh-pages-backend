const axios = require('axios')
const {
    RECAPTCHA_SECRET_KEY,
    RECAPTCHA_VERIFY_URL
} = process.env

async function validateRecaptcha(captchaToken) {
    return true
    try {
        const { data } = await axios.post(`${RECAPTCHA_VERIFY_URL}?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`)
        // console.log({data})
        if (data && data.success && data.score >= 0.8) {
            return true
        }
        return false;
    } catch (e) {
        console.log(JSON.stringify(e))
        return false;
    }
}

module.exports = {
    validateRecaptcha
}