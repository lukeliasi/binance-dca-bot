![Binance DCA Bot Banner](/banner.jpg)
# Binance DCA (Dollar-Cost-Averaging) Bot

This bot allows you to sit back and relax while it automatically invests in cryptocurrency on the Binance exchange for you. The bot allows you to set up recurring buys for any cryptocurrency supported on the exchange at any interval you want. Both fiat to crypto and crypto to crypto purchases supported.


![Binance DCA Bot Demo](/demo.gif)

## Getting Started
### Create a Binance Account
Sign up to Binance if you do not already have an account and complete any verification that may be required. You can use my sign-up referral link here if you wish: https://www.binance.com/en/register?ref=W3V44WHT. By using this link you earn a small amount of BTC commission on any trades I make.

## Generate API keys
[Create a new API key on Binance](https://www.binance.com/en/support/faq/360002502072). You should select **Enable Reading** and **Enable Spot & Margin Trading** for the restrictions.

### Set up the project
[Node.js](https://nodejs.org) v13 or higher required.
```
git clone https://github.com/lukeliasi/binance-dca-bot.git
cd binance-dca-bot
npm install
```

### Configure the bot
Create a `config.js` file in the root, you can copy the example template:
`cp config.example.js config.js`

Fill out each part of the config.js adding your Binance API keys and set up the buys.

#### Configuration Options:
| Option             | Description |
| -----------        | ----------- |
| `binance_key`      | Your Binance API Key |
| `binance_secret`   | Your Binance API Secret |
| `sendgrid_secret`  | An optional SendGrid API key for the bot to send you email notifications when buy orders are executed |
| `notifications`    | If using SendGrid notifications this value should be an object structured like so: `notifications: { to: "example@example.com", from: "noreply@example.com" }` |
| `buy`              | Array of objects for each buy you want to set up. |

#### Buy object:
| Parameter                     | Description |
| -----------                   | ----------- |
| `asset`                       | The asset you want to buy | 
| `currency`                    | The currency you want to use to buy the asset. E.g: "USD", "GBP", "BTC" etc... |
| `quoteOrderQty` or `quantity` | Use `quoteOrderQty` for the amount you want to spend/invest or alternatively you can set `quantity` to buy a set amount of the asset regardless of price. Note [Binance trading rules](https://www.binance.com/en/trade-rule) pairs have minimum and maximum order sizes  |
| `schedule`                    | A cron expression to set when the buy order should execute for this asset. See [Crontab.guru](https://crontab.guru/) for help setting up schedules. You can omit this `schedule` parameter and the buy order will execute immediately |

### Start the bot
Use this command to start the bot: `npm run start`. The program must stay running, and it will execute the buy orders at the defined schedules using cron jobs.

### Deployment
Consider running the bot in the cloud, so you do not need to run the bot constantly on your machine. I personally recommend and use a Vultr instance, the $5 /month plan is fine to run the bot. You can use my referal link here to receive $100 of credit for free: https://www.vultr.com/?ref=8768322-6G. You will want to use [PM2](https://github.com/Unitech/pm2) process manager on the server which keeps the bot running and can restart the bot automatically if the server or program crashes.

### Disclaimer
Use at your own risk. I am not liable for how you use the bot.



