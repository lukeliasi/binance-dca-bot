import fetch from "node-fetch";

export class TelegramAPI {
	/**
	 * @param {string} token
	 * @param {string} chatId
	 */
	constructor(token, chatId) {
		this.apiUrl = "https://api.telegram.org";
		this.token = token;
		this.chatId = chatId;
	}

	/**
	 * Send a message to the chat
	 * @param {string} message
	 */
	async sendMessage(message) {
		if (!this.token) {
			return;
		}

		let params = {
			chat_id: this.chatId,
			text: message,
			parse_mode: "markdown"
		}

		const url = `${this.apiUrl}/bot${this.token}/sendMessage?${new URLSearchParams(params).toString()}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			return await response.json();
		} catch (error) {
			console.error(error);
		}
	}
}
