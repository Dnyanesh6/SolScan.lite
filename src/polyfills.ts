import { getRandomValues as expoCryptoGetRandomValues } from "expo-crypto";
import { Buffer } from "buffer";
import process from "process";

// Buffer
global.Buffer = global.Buffer || Buffer;

// Process
global.process = process;

if (!global.process.env) {
  global.process.env = { NODE_ENV: "production" };
}

// Crypto
class Crypto {
  getRandomValues = expoCryptoGetRandomValues;
}

const webCrypto =
  typeof global.crypto !== "undefined" ? global.crypto : new Crypto();

if (typeof global.crypto === "undefined") {
  Object.defineProperty(global, "crypto", {
    configurable: true,
    enumerable: true,
    get: () => webCrypto,
  });
}