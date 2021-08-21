import cron from "node-schedule";
import cronstrue from "cronstrue";
import colors from "colors";
import http from "http";
import { config } from "../config.js";
import { BinanceAPI } from "./services/binance-api.js";
import { SendGridNotification } from "./services/sendgrid-notification.js";
import { TelegramAPI } from "./services/telegram-api.js"
import { MongoDb } from "./services/mongodb.js";


/**
 * Simple HTTP server (so Heroku and other free SaaS will not bother on killing the app on free plans)
 * Can always use something like Kaffeine to keep it alive
 */
const PORT = process.env.PORT || config.port || 3000;
const requestListener = function (req, res) {
	res.writeHead(200);
	res.end('Hello, World!');
}
const server = http.createServer(requestListener);
server.listen(PORT);

/**
 * Binance Integration
 */
const BUY_ASSETS = process.env.BUY_ASSETS || config.buy || [];
const BINANCE_KEY = process.env.BINANCE_KEY || config.binance_key;
const BINANCE_SECRET = process.env.BINANCE_SECRET || config.binance_secret;
const binance = new BinanceAPI(BINANCE_KEY, BINANCE_SECRET);

/**
 * Telegram Integration
 */
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || config.telegram_token;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || config.telegram_chat_id;
const telegram = new TelegramAPI(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID);

/**
 * SendGrid Integration
 */
const SENDGRID_SECRET = process.env.SENDGRID_SECRET || config.sendgrid_secret;
const SENDGRID_TO = process.env.SENDGRID_TO || config.notifications?.to;
const SENDGRID_FROM = process.env.SENDGRID_FROM || config.notifications?.from;
const sendGrid = new SendGridNotification(SENDGRID_SECRET, SENDGRID_TO, SENDGRID_FROM);

/**
 * MongoDb Integration
 */
const MONGODB_URI = process.env.MONGODB_URI || config.mongodb_uri;
const mongoDb = new MongoDb(MONGODB_URI);

/**
 * Actually place the order
 * @param {object} coin
 */
async function placeOrder(coin) {
	const { asset, currency, quantity, quoteOrderQty } = coin;
	const pair = asset + currency;
	const response = await binance.marketBuy(pair, quantity, quoteOrderQty);

	if (response.orderId) {
		const successText = `Successfully purchased: ${response.executedQty} ${asset} @ ${response.fills[0].price} ${currency}. Spent: ${response.cummulativeQuoteQty} ${currency}.\n`;
		const data = `${JSON.stringify(response)}\n`;

		console.log(colors.green(successText), colors.grey(data));

		await mongoDb.saveOrder(order);

		await sendGrid.send(`Buy order executed (${pair})`, successText + data);

		const details = binance.getOrderDetails("BTC", "EUR", response);
		await telegram.sendMessage(`✅ *Buy order executed (${pair})*\n\n` +
			`_Order ID:_ ${details.orderId}\n` +
			`_Date:_ ${details.transactionDateTime}\n` +
			`_Quantity:_ ${details.quantity} ${details.asset}\n` +
			`_Total:_ ${details.totalCost} ${details.currency}\n` +
			`_Average Value:_ ${details.averageAssetValue} ${details.currency}/${details.asset}\n` +
			`_Fees:_ ${details.commissions} ${details.commissionAsset}\n\n` +
			`${details.fills.join('\n')}`);
	} else {
		const errorText = response.msg || `Unexpected error placing buy order for ${pair}`;
		console.error(colors.red(errorText));

		await sendGrid.send(`Buy order failed(${pair})`, errorText);
		await telegram.sendMessage(`❌ *Buy order failed (${pair})*\n\n` +
			'```' +
			`${errorText}` +
			'```');
	}
}

/**
 * Get human-readable details on the buy to perform
 * @param {object} buy
 */
function getBuyDetails(buy) {
	return BUY_ASSETS.map(c => {
		if (c.quantity) {
			return `${c.quantity} ${c.asset} with ${c.currency} ${c.schedule ? cronstrue.toString(c.schedule) : "immediately."}`
		}
		else {
			return `${c.quoteOrderQty} ${c.currency} of ${c.asset} ${c.schedule ? cronstrue.toString(c.schedule) : "immediately."}`
		}
	}).join('\n');
}

/**
 * Check if .env variables or config parameters are valids
 */
function checkForParameters() {

	if (!BINANCE_KEY || !BINANCE_SECRET) {
		console.log(colors.red("No Binance API key, please update environment variables or config.js"));
		return false;
	}

	if (!BUY_ASSETS || BUY_ASSETS.length == 0) {
		console.log(colors.red("No coin to buy, please update environment variables or config.js"));
		return false;
	}

	return true;
}

/**
 * Loop through all the assets defined to buy in the config and schedule the cron jobs
 */
async function runBot() {
	console.log(colors.magenta("Starting Binance DCA Bot"), colors.grey(`[${new Date().toLocaleString()}]`));

	if (!checkForParameters()) {
		return;
	}

	for (const coin of BUY_ASSETS) {
		const { schedule, asset, currency, quantity, quoteOrderQty } = coin;

		if (quantity && quoteOrderQty) {
			throw new Error(`Error: You can not have both quantity and quoteOrderQty options at the same time.`);
		}

		if (quantity) {
			console.log(colors.yellow(`CRON set up to buy ${quantity} ${asset} with ${currency} ${schedule ? cronstrue.toString(schedule) : "immediately."}`));
		} else {
			console.log(colors.yellow(`CRON set up to buy ${quoteOrderQty} ${currency} of ${asset} ${schedule ? cronstrue.toString(schedule) : "immediately."}`));
		}

		// If a schedule is not defined, the asset will be bought immediately
		// otherwise a cronjob is setup to place the order on a schedule
		if (!schedule) {
			await placeOrder(coin);
		} else {
			cron.scheduleJob(schedule, async () => await placeOrder(coin));
		}
	}

	await telegram.sendMessage('🏁 *Binance DCA Bot Started*\n\n' +
		`_Date:_ ${new Date().toLocaleString()}\n\n` +
		'```\n' +
		getBuyDetails(BUY_ASSETS) +
		'```');
}

await runBot();
