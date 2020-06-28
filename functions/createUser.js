const admin = require('firebase-admin')

module.exports = async (req, res) => {
    //Verify the user provided a phone
    if (!req.body.phone){
        return res.status(422).send({error: 'Please provide a phone number!'})
    }
    //format the phone number to remove all dashes and parenthesis
    //usually it's 50/50 as to whether someone sends the string or the numbers of the phone number
    const phone = String(req.body.phone).replace(/[^\d]/g, '')

    //create a new user account with that phone number

    try {
        const user = await admin.auth().createUser({
            uid: phone
        })
        //respond to the user request, saying the account was successfully created
        return res.status(200).send(user)
        
    } catch (err) {
        return res.status(500).send({error: err})
    }
}