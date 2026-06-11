# Solscan Lite Mobile App

A lightweight React Native mobile application for exploring Solana blockchain data on mobile devices.

---

## 🚀 Features

- View Solana wallet details
- View recent transactions
- Mobile-friendly and lightweight UI
- Real-time blockchain data via Solscan API

---

## 🛠 Tech Stack

- React Native
- JavaScript / TypeScript
- Solscan API
- Axios / Fetch
- Expo (if applicable)

---

## 💡 Motivation

I built this project to get hands-on experience with React Native and mobile development while working with real blockchain data from the Solana ecosystem. The goal was to create a simple, fast, and usable mobile interface inspired by Solscan.

---

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm 
- React Native CLI or Expo CLI

### Installation

```bash
git clone [https://github.com/yourusername/SolScan.lite.git]
cd solscan.lite
npm install
npm expo start
```

>For using the solana mobile wallet adapter we need to pre build the application so that the app can interact with the Wallets.


```bash
npx expo install expo-dev-client //install expo-dev client

npx expo prebuild

//connect a real android phone and check the device 
adb devices

npx expo run:android  //to-do this make sure you should have jdk version 17 

or 

npx expo run:ios

```
____

# Working Video

[![Watch Demo](/assets//thumbnail.png)](/assets//Solscan%20lite.mp4)