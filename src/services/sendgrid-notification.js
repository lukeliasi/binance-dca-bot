import mail from "@sendgrid/mail";

export class SendGridNotification {
	/**
	 * @param {string} secret
	 * @param {string} to
	 * @param {string} from
	 */
	constructor(secret, to, from) {
		this.secret = secret;
		this.to = to;
		this.from = from;

		if (this.secret) {
			mail.setApiKey(this.secret);
		}
	}

	/**
	 * @param {string} subject
	 * @param {string} text
	 */
	async send(subject, text) {
		if (this.secret) {
			const email = { to: this.to, from: this.from, subject, text };

			try {
				await mail.send(email);
			} catch (error) {
				console.log("Failed to send notification email.");
				console.error(error);
			}
		}
	}
}
