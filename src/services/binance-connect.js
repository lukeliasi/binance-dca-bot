import {  config } from "../../config.js";
import Binance from "node-binance-api";

const binanceApi = new Binance().options({
  APIKEY: config.binance.key,
  APISECRET: config.binance.secret,
  useServerTime: true,
  recvWindow: 60000, // Set a higher recvWindow to increase response timeout
});

export { binanceApi };