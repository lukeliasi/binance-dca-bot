import fetch from "node-fetch";
import crypto from "crypto";
import querystring from "querystring";

export class BinanceAPI {
  /**
   * @param {string} key
   * @param {string} secret
   * @param {object} options
   */
  constructor(key, secret, options = {}) {
    this.apiUrl = "https://api.binance.com";
    this.key = key;
    this.secret = secret;
    this.options = {
      recvWindow: options.recvWindow || 20000
    };
  }

  buildParams() {
    const params = {
      recvWindow: this.options.recvWindow,
      timestamp: Date.now(),
    }

    return querystring.stringify(params);
  }

  createSignature() {
    return crypto
      .createHmac("sha256", this.secret)
      .update(this.buildParams())
      .digest("hex");
  }

  /**
   * @param {string} symbol
   * @param {string} quantity
   * @param {string} quoteOrderQty
   */
  async marketBuy(symbol, quantity, quoteOrderQty) {
    const signature = this.createSignature();

    let body = {
      symbol: symbol,
      side: "BUY",
      type: "MARKET",
    }

    if (quantity) body.quantity = quantity;
    if (quoteOrderQty) body.quoteOrderQty = quoteOrderQty;

    const url = `${this.apiUrl}/api/v3/order?${this.buildParams()}&signature=${signature}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "X-MBX-APIKEY": this.key,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      return await response.json();
    } catch(error) {
      console.log(error);
    }
  }
}