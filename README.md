# bubble-face-bot

![License](https://img.shields.io/github/license/yanislav-igonin/bubble-face-bot.svg) ![Issues](https://img.shields.io/github/issues/yanislav-igonin/bubble-face-bot.svg) ![forks](https://img.shields.io/github/forks/yanislav-igonin/bubble-face-bot) ![stars](https://img.shields.io/github/stars/yanislav-igonin/bubble-face-bot) ![size](https://img.shields.io/github/repo-size/yanislav-igonin/bubble-face-bot)

This is telegram bot written in typescript that uses [Bubble Face](https://face.bubble.ru/) API.

## Motivation

Didn't find any telegram bot with this functionality, so I decided to make my own.

## Deployed Instance

[Bubble Face Bot](https://t.me/bubble_face_bot)

## Installation

```bash
> git clone https://github.com/yanislav-igonin/bubble-face-bot.git

> cd bubble-face-bot

> npm i

> BOT_TOKEN=... npm run dev

OR IF DOCKERWAY PREFERED

> BOT_TOKEN=... docker-compose -f development.docker-compose.yml up --build
```

Development environment uses `nodemon` for auto restart on code changes.

Bot uses [Imaginary](https://github.com/h2non/imaginary) to convert stickers from `webp` to `png` to process it on [Bubble Face](https://face.bubble.ru/) API.

## Bugs

This project is getting upgrades in my free time.  
If there is a problem please create a bug report in the issues section.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


