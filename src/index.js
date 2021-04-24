import { BinanceAPI } from "./services/binance-api.js";
import { config } from "../config.js";

async function runBot() {
  const api = new BinanceAPI(config.binance.key, config.binance.secret);
  const buylist = config.buy;

  //* Set up CRON to buy the assets at their defined schedules */
  for (const coin of buylist) {
    const { asset, currency, spend, schedule } = coin;
    const pair =  asset + currency;


    const buyResponse = await api.marketBuy(pair, undefined, spend);
    console.log(buyResponse);
  }
}

await runBot();
