![Binance DCA Bot Banner](/images/banner.jpg)

# Binance DCA (Dollar-Cost-Averaging) Bot

This bot allows you to sit back and relax while it automatically invests in cryptocurrency on the Binance exchange for you. The bot allows you to set up recurring buys for any cryptocurrency supported on the exchange at any interval you want. Both fiat to crypto and crypto to crypto purchases supported.

![Binance DCA Bot Demo](/images/demo.gif)

---

## v2.0.0 breaking changes

Version `2.0.0` drops supports to `config.js` configuration file in favor of `.env` file or Environment Variables.
New `trades.js` now supports all the required settings to perform crypto trades (same format as before), separating sensitive data (api keys, connection strings, emails) from the non-sensitive one (crypto pairs).
All other settings (API/Telegram/SendGrid/MongoDB/...) needs to be set using Environment Varaibles or `.env` file.

---

## Contents

- [Binance DCA (Dollar-Cost-Averaging) Bot](#binance-dca-dollar-cost-averaging-bot)
  - [v2.0.0 breaking changes](#v200-breaking-changes)
  - [Contents](#contents)
  - [Setup](#setup)
    - [Generate API keys](#generate-api-keys)
    - [Create the project](#create-the-project)
  - [Configure the bot](#configure-the-bot)
    - [Trades.js file](#tradesjs-file)
      - [Trades object](#trades-object)
    - [Environment Variables (.env)](#environment-variables-env)
  - [Running the bot](#running-the-bot)
    - [Alternative: Using Docker](#alternative-using-docker)
  - [Telegram integration](#telegram-integration)
    - [Create the bot](#create-the-bot)
    - [Start the bot](#start-the-bot)
    - [Get the chat id](#get-the-chat-id)
  - [Deployment](#deployment)
  - [Automating fiat deposits to Binance](#automating-fiat-deposits-to-binance)
  - [Donations](#donations)
  - [TODO list](#todo-list)
  - [Disclaimer](#disclaimer)
  - [License](#license)

## Setup

### Generate API keys

[Create a new API key on Binance](https://www.binance.com/en/support/faq/360002502072). You should select **Enable Reading** and **Enable Spot & Margin Trading** for the restrictions.

![Binance API](/images/api.png)

**NB:** be aware that API permissions will last for 90 days, after that period you need to set permissions again. This is a Binance security feature to prevent API to be generated and forgotten active.

### Create the project

[Node.js](https://nodejs.org) v13 or higher required.

```bash
git clone https://github.com/lukeliasi/binance-dca-bot.git
cd binance-dca-bot
npm install
```

## Configure the bot

All the required settings needs to be set using Environment Variables or `.env` file. The trades you want to make can be configured in a `trades.js` file in the root or with environment variables.

Rename the `env.example` to `.env` file for a quick bootstrap.

### Trades.js file

Configure the `trades.js` file in the root, you can uncomment and edit the provided example file.

**NB:** you may also define trades as an Environment Variables (see section below).

#### Trades object

| Parameter                     | Description                                                                                                                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `asset`                       | The asset you want to buy                                                                                                                                                                                                                                                |
| `currency`                    | The currency you want to use to buy the asset. E.g: "USD", "GBP", "BTC" etc...                                                                                                                                                                                           |
| `quoteOrderQty` or `quantity` | Use `quoteOrderQty` for the amount you want to spend/invest or alternatively you can set `quantity` to buy a set amount of the asset regardless of price. Note [Binance trading rules](https://www.binance.com/en/trade-rule) pairs have minimum and maximum order sizes |
| `schedule`                    | A cron expression to set when the buy order should execute for this asset. See [Crontab.guru](https://crontab.guru/) for help setting up schedules. You can omit this `schedule` parameter and the buy order will execute immediately                                    |

### Environment Variables (.env)

**NB:** `TRADES` environment variable has priority over the `trades.js` file values.

These are all the supported settings:

| Name             | Description                                                                                  |           Required            |
| ---------------- | -------------------------------------------------------------------------------------------- | :---------------------------: |
| BINANCE_KEY      | Your Binance API Key                                                                         |              YES              |
| BINANCE_SECRET   | Your Binance API Secret                                                                      |              YES              |
| BINANCE_TESTNET  | Set to true if you would like to connect to the Binance Testnet API                          |              NO               |
| SENDGRID_SECRET  | SendGrid API key for the bot to send you email notifications when buy orders are executed    |              NO               |
| SENDGRID_FROM    | If using SendGrid notifications this is the sender email address                             |              NO               |
| SENDGRID_TO      | If using SendGrid notifications this is the recipient email address                          |              NO               |
| TELEGRAM_TOKEN   | If using Telegram notifications this value is the BotFather's generated token                |              NO               |
| TELEGRAM_CHAT_ID | If using Telegram notifications this value is the chat identifier to which send notification |              NO               |
| MONGODB_URI      | If using MongoDb Atlas this is the connection string                                         |              NO               |
| TRADES           | This is the stringified version of the `trades.js` file content                              | ONLY IF NOT USING `trades.js` |

## Running the bot

Use this command to start the bot: `npm run start`. The program must stay running, and it will execute the buy orders at the defined schedules using cron jobs.

### Alternative: Using Docker

You can also build a **Docker** image of the bot and run it without having to install Node.js. To do that, and assuming [Docker](https://docs.docker.com/get-docker/) is installed, first build the image:

```
docker build -t binance-dca-bot .
```

then you can execute it with:

```
docker run -v $PWD/trades.js:/app/trades.js binance-dca-bot
```

## Telegram integration

This bot has a built-in Telegram integration that just needs to be configured.

First of all you need to create your personal Telegram Bot, we do not provide any public bot because it will then needs maintenance and/or accessing minimal personal informations.

*Do it yourself and stay safe* 😎.

### Create the bot

Telegram has an easy way to create bots, it really just takes a couple of steps.

1. Open `Telegram` and search for `BotFather` chat
2. Eventually start the bot and run the `/newbot` command.
3. Enter the `name` you want to use for the bot.
4. Enter the `username` for the bot (it must ends with `bot`).
5. Done!

![Telegram Bot Setup](/images/telegram-bot.png)

In the last message you can find the `HTTP API` token that you need to use. **Store it securely and do not share with anyone**.

> **That string needs to be placed in the `TELEGRAM_TOKEN` environment variable.**

### Start the bot

After you created the bot just search for it and send any dummy message. It can be anything, you just need to send some data to the bot for the next step.

### Get the chat id

Open the browser and navigate to this url:

> `https://api.telegram.org/bot<token>/getUpdates`

Replace `<token>` with the HTTP API from previous step, do not remove `bot` at the beginning of the string.

If you have done everything right it will reply with a JSON containing some informations (this is a simplified version where we removed useless info).

```json
{
 "ok": true,
 "result": [
  {
   "update_id": 123456789,
   "message": {
    "message_id": 123,
    "from": {
     "id": XXXXXXXX,
     "is_bot": false,
     "first_name": "Jon",
     "last_name": "Doe",
     "username": "jondoe",
     "language_code": "en"
    },
    "date": 1637489677,
    "text": "hello there",
   }
  }
 ]
}
```

What we really need is the chat id located in:

`result->message->from->id`

> **That string need to be placed in the `TELEGRAM_CHAT_ID` environment variable.**

That's all we needs to have Telegram notifications when the bot starts or performs trades.

![Telegram Bot Messages](/images/telegram-bot-messages.png)

**NB:** if you're adding the bot to a `Group Chat` the process is a bit different but there are easy-to-use bots that helps you retrieve the chat id such as [@RawDataBot](https://t.me/RawDataBot), remember to kick it after you get what you need (just in case).

## Deployment

Consider running the bot in the cloud, so you do not need to run the bot constantly on your machine.

Some options:

- [Vultr](https://www.vultr.com/?ref=8944587-8H) - $100 free credit using link
- [Digital Ocean](https://m.do.co/c/4f3661af7d87) - $100 free credit using link
- [Linode](https://www.linode.com/)
- [Heroku](https://www.heroku.com/)

You will want to use [PM2](https://github.com/Unitech/pm2) process manager or similar on the server which keeps the bot running and can restart the bot automatically if the server or program crashes.

Remember the remote server may be in a different timezone to you, run the command `date` to see the servers timezone to configure your cron accordingly.

**NB:** If you are using Heroku, the free tier is enough for this bot. Please consider to use [Kaffeine](https://kaffeine.herokuapp.com/) to keep the bot awake.

## Automating fiat deposits to Binance

For further automation you can deposit funds into your Binance account automatically via bank transfer. Simply initiate a fiat deposit (bank transfer) via the Binance website and note down the bank details you need to pay to. The reference code and other details never change, so you can set up a standing order with your bank to automatically transfer money to Binance on a schedule with these details.

As an exmaple, you could set up a standing order to deposit to Binance the day after you get paid, and then configure the bot to purchase your crypto the following day.

## Donations

If you found this project helpful and would like to support me, you can donate to one of the following crypto addresses:

- **BTC**: 1LeisHRv4yLyzQg6M79f48ej9cnkruh6WH
- **ETH**: 0x804d2f31cc49a68011271b1d56884d0efa9e9ce9
- **DOGE**: DBa2UFwonN4QcunXY8Thev9oCxMkDrr9rm
- **XRP**: rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh tag: 101391719
- **USDT**: 0x804d2f31cc49a68011271b1d56884d0efa9e9ce9

## TODO list

- [ ] Add features to README:
  - [x]  Telegram integration
  - [ ]  MongoDB integration
  - [ ]  SendGrid integration
- [ ] Write tests
- [ ] Standardised messaging across all notification/storage platforms, email, terminal/cli, Mongo, Telegram etc...

## Disclaimer

Use at your own risk. I am not liable for how you use the bot.

## License

[MIT License](http://opensource.org/licenses/MIT)
