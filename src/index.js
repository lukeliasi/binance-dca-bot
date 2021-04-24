import { binanceApi } from "./services/binance-connect.js";
import { config } from "../config.js";

async function runBot() {
  const buylist = config.buy;
  // return await binanceApi.marketBuy("BTCGBP", 10);
  // cron.scheduleJob(schedule, async () => await init(token));

  //* Set up CRON to buy the assets at their defined schedules */
  for (const coin of buylist) {
    const { asset, currency, spend, schedule } = coin;
    const pair =  asset + currency;
    const buyResponse = await binanceApi.marketBuy(pair, spend);
    console.log(buyResponse);
  }
}

await runBot();
