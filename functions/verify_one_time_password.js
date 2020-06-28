const admin = require('firebase-admin')

module.exports = async (req, res) => {
	if (!req.body.phone || !req.body.code) {
		return res
			.status(422)
			.send({ error: 'phone and code must be provided' })
	}

	const phone = String(req.body.phone).replace(/[^\d]/g, '')
	const code = parseInt(req.body.code)
	try {
		await admin.auth().getUser(phone)
		const ref = admin.database().ref(`users/${phone}`)
		ref.on('value', async snapshot => {
            ref.off()
			const user = snapshot.val()

			if (user.code !== code || !user.codeValid) {
				return res.status(422).send({ error: 'Code not valid' })
			}

            ref.update({ codeValid: false })
            //.createCustomToken is a built in firebase method in auth() module to create custom jwt
            const token = await admin.auth().createCustomToken(phone)
            return res.send({token})
		})
	} catch (err) {
		return res.status(422).send({ error: err + "this is the error" })
	}
}
