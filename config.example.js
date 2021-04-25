const config = {
  binance_key: "your-binance-api-key",
  binance_secret: "your-binance-api-secret",
  buy: [
    {
      asset: "BTC", // Asset you want to buy
      currency: "GBP", // Currency you want to buy the asset with
      quoteOrderQty: 10, // Buy £10 GBP worth of BTC
      schedule: "0 4 * * SUN"  // Place order every Sunday at 4am - https://crontab.guru/#0_4_*_*_SUN
    },
    {
      asset: "LSK",
      currency: "BTC", // Buy LSK with BTC
      quantity: 5, // Buy 5 LSK, regardless of the price
      schedule: "0 22 * * 1-5"  // Place order on the first day of every month - https://crontab.guru/#0_0_1_*_*
    },
  ]
}

export { config };