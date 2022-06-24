import fetch from "node-fetch";
import crypto from "crypto";

export class BinanceAPI {
	/**
	 * @param {boolean} testnet
	 * @param {string} key
	 * @param {string} secret
	 */
	constructor(testnet, key, secret) {
		this.key = key;
		this.secret = secret;
		this.testnet = testnet;

		this.apiUrl = this.testnet ? "https://testnet.binance.vision" : "https://api.binance.com";

		if (!this.key) throw new Error("No Binance API Key found in .env");
		if (!this.secret) throw new Error("No Binance API Secret found in .env");
	}

	/**
	 * Create signature for the payload
	 * @param {object} params
	 */
	createSignature(params) {
		return crypto
			.createHmac("sha256", this.secret)
			.update(new URLSearchParams(params).toString())
			.digest("hex");
	}

	/**
	 * Get account information
	 * @returns {object} account information
	 */
	async getAccountInfo() {
		let params = {
			recvWindow: 30000,
			timestamp: Date.now(),
		}

		params.signature = this.createSignature(params);

		const url = `${this.apiUrl}/api/v3/account?${new URLSearchParams(params).toString()}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"X-MBX-APIKEY": this.key,
					"Content-Type": "application/json"
				}
			});

			return await response.json();
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Create a market buy order
	 * @param {string} symbol
	 * @param {string} quantity
	 * @param {string} quoteOrderQty
	 */
	async marketBuy(symbol, quantity, quoteOrderQty) {
		let params = {
			symbol: symbol,
			side: "BUY",
			type: "MARKET",
			recvWindow: 30000,
			timestamp: Date.now(),
		}

		if (quantity) params.quantity = quantity;
		if (quoteOrderQty) params.quoteOrderQty = quoteOrderQty;

		params.signature = this.createSignature(params);

		const url = `${this.apiUrl}/api/v3/order?${new URLSearchParams(params).toString()}`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"X-MBX-APIKEY": this.key,
					"Content-Type": "application/json"
				}
			});

			return await response.json();
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Get order details
	 * @param asset
	 * @param currency
	 * @param {object} order
	 */
	getOrderDetails(asset, currency, order) {
		return {
			asset,
			currency,
			orderId: order.orderId,
			transactionDateTime: new Date(order.transactTime).toLocaleString("en-US"),
			quantity: parseFloat(order.executedQty),
			totalCost: order.fills.reduce((total, f) => (f.price * f.qty) + total, 0),
			averageAssetValue: order.fills.reduce((total, f) => (f.price * f.qty) + total, 0) / order.executedQty,
			commissions: order.fills.reduce((total, obj) => (obj.commission * 1.0) + total, 0),
			commissionAsset: order.fills[0].commissionAsset,
			fills: order.fills.map(({ price, qty, commission, commissionAsset }) => `💰 ${parseFloat(qty)} ${asset} x ${parseFloat(price)} ${currency} (fee: ${parseFloat(commission)} ${commissionAsset})`)
		}
	}
}
