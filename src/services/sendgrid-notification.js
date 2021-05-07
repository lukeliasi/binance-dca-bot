import mail from "@sendgrid/mail";

export class SendGridNotification {
  /**
   * @param {string} secret
   */
  constructor(secret) {
    this.secret = secret;
    if (this.secret) {
      mail.setApiKey(this.secret);
    }
  }

  /**
   * @param {string} to
   * @param {string} from
   * @param {string} subject
   * @param {string} text
   */
  async send(to, from, subject, text) {
    if (this.secret) {
      const email = { to, from, subject, text };

      try {
        await mail.send(email);
      } catch(error) {
        console.log("Failed to send notification email.");
        console.error(error);
      }
    }
  }
}