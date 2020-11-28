const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';
const config = require('../../env')

// configuration de l'envoie email
const oauth2Client = new OAuth2(
    config.ID_CLIENT_SERVICE_MAIL,
    config.MAIL_CODE_CLIENT_SECRET,
    config.MAIL_SERVICE_REFRECH_TOKEN,
    config.ADDRESS_EMAIL_ENVOI,
    OAUTH_PLAYGROUND
)

// send email
const sendMail = (to, url, message) => {
    oauth2Client.setCredentials({
        refresh_token: config.MAIL_SERVICE_REFRECH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()
    const smptTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: config.ADDRESS_EMAIL_ENVOI,
            clientId: config.ID_CLIENT_SERVICE_MAIL,
            clientSecret: config.MAIL_CODE_CLIENT_SECRET,
            refreshToken: config.MAIL_SERVICE_REFRECH_TOKEN,
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
                Afin de rénitialiser votre mot de passe, veuillez cliquer sur ce bouton. 
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${message}</a>
        
            <p>Si le bouton ne fonctionne pas vous pouvez cliquer sur ce lien ou le copier et coller dans le navigateur</p>
        
            <div>${url}</div>
            </div>
        `
    }

    smptTransport.sendMail(mailOptions, (err, infor) => {
        if (err) return err
        return infor;
    });
}

module.exports = sendMail