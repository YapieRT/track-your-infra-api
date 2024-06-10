import mailjet from 'node-mailjet';

export default class MailService {
  constructor() {
    this.mailjet = mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
  }

  async sendInvite(to, password) {
    const request = this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
            Name: process.env.MAILJET_SENDER_NAME,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: `Invintation to Track Your Infra`,
          HTMLPart: `
            <div>
              <h1>You were invited to Track Your Infra</h1>
              <h3>Follow the https://${process.env.DOMAIN_NAME} link to Sign In</h1>
              <h3>Password: ${password}</h1>
            </div>
          `,
        },
      ],
    });

    try {
      const result = await request;
      console.log(result.body);
    } catch (error) {
      console.error(error.statusCode, error.message);
    }
  }
}
