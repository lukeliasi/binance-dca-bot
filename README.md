![Binance DCA Bot Banner](/banner.jpg)

# Binance DCA (Dollar-Cost-Averaging) Bot

This bot allows you to sit back and relax while it automatically invests in cryptocurrency on the Binance exchange for you. The bot allows you to set up recurring buys for any cryptocurrency supported on the exchange at any interval you want. Both fiat to crypto and crypto to crypto purchases supported.

![Binance DCA Bot Demo](/demo.gif)

## Getting Started

### Create a Binance Account

Sign up to [Binance](https://www.binance.com/en/register?ref=W3V44WHT) if you do not already have an account and complete any verification that may be required. You can use my sign-up referral link here if you wish: <https://www.binance.com/en/register?ref=W3V44WHT>. By using this link you earn a small amount of BTC commission on any trades I make.

### Generate API keys

[Create a new API key on Binance](https://www.binance.com/en/support/faq/360002502072). You should select **Enable Reading** and **Enable Spot & Margin Trading** for the restrictions.

## Set up the project

[Node.js](https://nodejs.org) v13 or higher required.

```
git clone https://github.com/lukeliasi/binance-dca-bot.git
cd binance-dca-bot
npm install
```

## Configure the bot

API keys can be configured both on the `config.js` and in the `environment variables` (.env).

Asset pairs **must** be configured only in the `config.js` file.

### Config.js

Create a `config.js` file in the root, you can copy the example template:

`cp config.example.js config.js`

Fill out each part of the config.js adding your Binance API keys and set up the buys.

### Configuration Options

**NB:** environment variable have priority over config.js values

#### Config.js

| Option             | Description                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `binance_key`      | Your Binance API Key                                                                                                                                           |
| `binance_secret`   | Your Binance API Secret                                                                                                                                        |
| `sendgrid_secret`  | An optional SendGrid API key for the bot to send you email notifications when buy orders are executed                                                          |
| `notifications`    | If using SendGrid notifications this value should be an object structured like so: `notifications: { to: "example@example.com", from: "noreply@example.com" }` |
| `telegram_token`   | If using Telegram notifications this value is the BotFather's generated token                                                                                  |
| `telegram_chat_id` | If using Telegram notifications this value is the chat identifier to which send notification                                                                   |
| `mongodb_uri`      | MongoDb Atlas connection string                                                                                                                                |
| `buy`              | Array of objects for each buy you want to set up.                                                                                                              |

#### .env

| Option             | Description                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `BINANCE_KEY`      | Your Binance API Key                                                                                  |
| `BINANCE_SECRET`   | Your Binance API Secret                                                                               |
| `SENDGRID_SECRET`  | An optional SendGrid API key for the bot to send you email notifications when buy orders are executed |
| `SENDGRID_TO`      | If using SendGrid notifications this value is used as destination email address                       |
| `SENDGRID_FROM`    | If using SendGrid notifications this value is used as origin email address                            |
| `TELEGRAM_TOKEN`   | If using Telegram notifications this value is the BotFather's generated token                         |
| `TELEGRAM_CHAT_ID` | If using Telegram notifications this value is the chat identifier to which send notification          |
| `MONGODB_URI`      | MongoDb Atlas connection string                                                                       |

#### Buy object

| Parameter                     | Description                                                                                                                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `asset`                       | The asset you want to buy                                                                                                                                                                                                                                                |
| `currency`                    | The currency you want to use to buy the asset. E.g: "USD", "GBP", "BTC" etc...                                                                                                                                                                                           |
| `quoteOrderQty` or `quantity` | Use `quoteOrderQty` for the amount you want to spend/invest or alternatively you can set `quantity` to buy a set amount of the asset regardless of price. Note [Binance trading rules](https://www.binance.com/en/trade-rule) pairs have minimum and maximum order sizes |
| `schedule`                    | A cron expression to set when the buy order should execute for this asset. See [Crontab.guru](https://crontab.guru/) for help setting up schedules. You can omit this `schedule` parameter and the buy order will execute immediately                                    |

## Start the bot

Use this command to start the bot: `npm run start`. The program must stay running, and it will execute the buy orders at the defined schedules using cron jobs.

## Deployment

Consider running the bot in the cloud, so you do not need to run the bot constantly on your machine. I personally recommend and use a [Vultr](https://www.vultr.com/?ref=8768322-6G) Cloud Compute VPS instance as the cheapest option. You can use my referal link here to receive $100 of credit for free: <https://www.vultr.com/?ref=8768322-6G> after you sign up.

You will want to use [PM2](https://github.com/Unitech/pm2) process manager or similar on the server which keeps the bot running and can restart the bot automatically if the server or program crashes.

Remember the remote server may be in a different timezone to you, run the command `date` to see the servers timezone to configure your cron accordingly.

## Automating fiat deposits to Binance

For further automation you can deposit funds into your Binance account automatically via bank transfer. Simply initiate a fiat deposit (bank transfer) via the Binance website and note down the bank details you need to pay to. The reference code and other details never change, so you can set up a standing order with your bank to automatically transfer money to Binance on a schedule with these details.

As an exmaple, you could set up a standing order to deposit to Binance the day after you get paid, and then configure the bot to purchase your crypto the following day.

## Donations

If you found this project helpful and would like to support me, you can donate to one of the following crypto addresses:

* **BTC**: 1LeisHRv4yLyzQg6M79f48ej9cnkruh6WH
* **ETH**: 0x804d2f31cc49a68011271b1d56884d0efa9e9ce9
* **DOGE**: DBa2UFwonN4QcunXY8Thev9oCxMkDrr9rm
* **XRP**: rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh tag: 101391719
* **USDT**: 0x804d2f31cc49a68011271b1d56884d0efa9e9ce9

## Disclaimer

Use at your own risk. I am not liable for how you use the bot.

## License

[MIT License](http://opensource.org/licenses/MIT)
