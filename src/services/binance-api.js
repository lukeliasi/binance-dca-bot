import fetch from "node-fetch";
import crypto from "crypto";
import querystring from "querystring";

export class BinanceAPI {
	/**
	 * @param {string} key
	 * @param {string} secret
	 */
	constructor(key, secret) {
		this.apiUrl = "https://api.binance.com";
		// this.apiUrl = "https://testnet.binance.vision";
		this.key = key;
		this.secret = secret;
	}

	/**
	 * @param {object} params
	 */
	createSignature(params) {
		return crypto
			.createHmac("sha256", this.secret)
			.update(querystring.stringify(params))
			.digest("hex");
	}

	/**
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

		const url = `${this.apiUrl}/api/v3/order?${querystring.stringify(params)}`;

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
			quantity: Math.round(order.executedQty),
			totalCost: order.fills.reduce((total, f) => (f.price * f.qty) + total, 0),
			averageAssetValue: order.fills.reduce((total, f) => (f.price * f.qty) + total, 0) / order.executedQty,
			commissions: order.fills.reduce((total, obj) => (obj.commission * 1.0) + total, 0),
			commissionAsset: order.fills[0].commissionAsset,
			fills: order.fills.map(({ price, qty, commission, commissionAsset }) => `💰 ${Math.round(qty)} ${asset} x ${Math.round(price)} ${currency} (fee: ${Math.round(commission)} ${commissionAsset})`)
		}
	}
}
