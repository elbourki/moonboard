# Moonboard

Monitor on-chain activity and get instant alerts delivered via email, text, and messaging platforms.

[Project description](https://devpost.com/software/moonboard) - [moonboard.co](https://moonboard.co)



## Installation guide

**Prerequisites**
```
# Make sure Node is available in your system

> git clone https://github.com/elbourki/moonboard.git
> npm install
> cp .env.example .env
```
**Running the app**
```
> npm run build
> npm run start
```
**Running the worker**
```
# Make sure pm2 is installed globally

> npm run worker:build
> pm2 start ecosystem.config.js
```
