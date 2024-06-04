import mailjet from 'node-mailjet';

export default class MailService {
  constructor() {
    this.mailjet = mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
  }

  async sendInvite(to) {
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
          Subject: `Account Activation on ${process.env.API_URL}`,
          HTMLPart: `
            <div>
              <h1>Для активації акаунту перейдіть за посиланям</h1>
              <p>Якщо ви не надавали цієї адреси для реєстрації, то проігноруйте це повідомлення.</p>
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
