import { BinanceAPI } from "./services/binance-api.js";
import { config } from "../config.js";

async function runBot() {
  const api = new BinanceAPI(config.binance.key, config.binance.secret);
  const buylist = config.buy;

  //* Set up CRON to buy the assets at their defined schedules */
  for (const coin of buylist) {
    const { asset, currency, quantity, schedule, quoteOrderQty } = coin;
    const pair =  asset + currency;

    if (quantity && quoteOrderQty) {
      throw new Error(`Error: [${pair}]: You can not have both quantity and quoteOrderQty options at the same time.`);
    }

    const buyResponse = await api.marketBuy(pair, quantity, quoteOrderQty);
    console.log(buyResponse);
  }
}

await runBot();
