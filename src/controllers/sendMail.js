const config = require('../../env')
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const oauth_playground = 'https://developers.google.com/oauthplayground'

// configuration de l'envoie email
const oauth2Client = new OAuth2(
    config.ID_CLIENT_SERVICE_MAIL,
    config.MAIL_CODE_CLIENT_SECRET,
    config.MAIL_SERVICE_REFRECH_TOKEN,
    config.ADDRESS_EMAIL_ENVOI,
    oauth_playground
)

// send email
const sendMail = (to, url) => {
    oauth2Client.setCredentials({
        refresh_token: config.MAIL_SERVICE_REFRECH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()
    const smptTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: config.ADDRESS_EMAIL_ENVOI,
            IdClient: config.ID_CLIENT_SERVICE_MAIL,
            refrechToken: config.MAIL_SERVICE_REFRECH_TOKEN,
            accessToken
        }
    });

    const mailOptions = {
        from: config.ADDRESS_EMAIL_ENVOI,
        to: to,
        subject: "Application Dropboite",
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Bienvenue sur l'application Dropboite</h2>
            <p>
                Veuillez cliquer sur ce bouton pour valider votre email
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            <p>Si le bouton ne fonctionne pas vous pouvez cliquer sur ce lien.</p>
        
            <div>${url}</div>
            </div>
        `
    }

    smptTransport.sendMail(mailOptions, (err, information) => {
        if (err) return err
        return information;
    });
}

module.exports = sendMail