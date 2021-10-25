import mongodb from 'mongodb';
const { MongoClient } = mongodb;

export class MongoDb {
	/**
	 * @param {string} uri 
	 */
	constructor(uri) {
		if (!uri) {
			return;
		}

		this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	}

	/**
	 * 
	 * @param {object} order
	 */
	async saveOrder(order) {
		if (!this.client) {
			return;
		}

		try {
			await this.client.connect();
			await this.client.db("binance_dca").collection("orders").insertOne(order);
		} catch (e) {
			console.error(e);
		} finally {
			await this.client.close();
		}
	}
}
