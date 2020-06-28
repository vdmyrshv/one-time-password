const admin = require('firebase-admin')
const twilio = require('./twilio')

module.exports = async (req, res) => {
	if (!req.body.phone) {
		return res
			.status(422)
			.send({ error: 'you must provide a valid phone number' })
	}

	const phone = String(req.body.phone).replace(/[^\d]/g, '')

	try {
		const userRecord = await admin.auth().getUser(phone)
		console.log('USER RECORD!!!', userRecord)
		const code = Math.floor(Math.random() * 9000 + 1000)
		const message = await twilio.messages.create({
			body: `Your activation code is ${code}`,
			from: '+15146136332',
			to: `+${userRecord.uid}`
		})
		admin
			.database()
			.ref(`users/${phone}`)
			.update({ code, codeValid: true }, () => {
				return res.status(200).send({ success: true })
			})
	} catch (err) {
		return res.status(422).send({ error: err })
	}
}
