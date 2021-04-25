import { BinanceAPI } from "./services/binance-api.js";
import { config } from "../config.js";
import cron from "node-schedule";
import cronstrue from "cronstrue";
import { Log } from "./services/log.js";
import { SendGridNotification } from "./services/sendgrid-notification.js";

const log = new Log();
const notification = new SendGridNotification(config.sendgrid_secret);

/**
 * @param {object} coin
 */
async function placeOrder(coin) {
  const api = new BinanceAPI(config.binance_key, config.binance_secret);
  const { asset, currency, quantity, quoteOrderQty } = coin;
  const pair =  asset + currency;
  const response = await api.marketBuy(pair, quantity, quoteOrderQty);

  if (response.orderId) {
    const successText = `Successfully purchased: ${response.executedQty} ${pair} @ ${response.fills[0].price}. Spend: ${response.cummulativeQuoteQty}.\n ${JSON.stringify(response)}`;
    log.write(successText, "green");
    await notification.send(config.notifications.to, config.notifications.from, `Buy order executed (${pair})`, successText);
  } else {
    const errorText = response.msg || `Unexpected error placing buy order for ${pair}`;
    log.write(errorText, "red", "error");
    await notification.send(config.notifications.to, config.notifications.from, `Buy order failed (${pair})`, errorText);
  }
}

// Loop through all the assets defined to buy in the config and schedule the cron jobs
async function runBot() {
  log.write('Starting Binance DCA Bot', "orange");

  for (const coin of config.buy) {
    const { schedule, asset, currency, quantity, quoteOrderQty } = coin;

    if (quantity && quoteOrderQty) {
      throw new Error(`Error: You can not have both quantity and quoteOrderQty options at the same time.`);
    }

    if (quantity) {
      log.write(`CRON set up to buy ${quantity} ${asset} with ${currency} ${schedule ? cronstrue.toString(schedule) : "immediately."}`, "yellow");
    } else {
      log.write(`CRON set up to buy ${quoteOrderQty} ${currency} of ${asset} ${schedule ? cronstrue.toString(schedule) : "immediately."}`, "yellow");
    }

    // If a schedule is not defined, the asset will be bought immediately
    // otherwise a cronjob is setup to place the order on a schedule
    if (!schedule) {
      await placeOrder(coin);
    } else {
      cron.scheduleJob(schedule, async () => await placeOrder(coin));
    }
  }
}

await runBot();