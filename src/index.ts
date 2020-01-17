import Telegraf, { ContextMessageUpdate, Telegram } from 'telegraf';
import * as ngrok from 'ngrok';
import * as crypto from 'crypto';
import axios from 'axios';
import FormData from 'form-data';

import { app } from './config';
import { logger } from './modules';

const bot = new Telegraf(app.botToken);
const telegram = new Telegram(app.botToken);

bot.catch((err: Error): void => {
  logger.error(`ERROR: ${err}\n`);
});

bot.start((ctx: ContextMessageUpdate): void => {
  ctx.reply(
    'Превратите себя в героя комиксов с помощью технологии машинного обучения'
    + ' Bubble Face. Каждый рисунок создается на основе уникальных стилей'
    + 'художников BUBBLE. Станьте частью нашей вселенной и удивите ваших друзей!',
  );
});

bot.on('photo', async (ctx: ContextMessageUpdate): Promise<void> => {
  try {
    // @ts-ignore
    const { photo } = ctx.update.message;
    const fileId = photo[photo.length - 1].file_id;
    // @ts-ignore // 'getFile' does not exist, bad typings
    // const fileInfo = await telegram.getFile(fileId);
    // console.log('DEBUG: fileInfo', fileInfo);
    const fileLink = await telegram.getFileLink(fileId);
    const { data: imageStream } = await axios.get(fileLink, {
      responseType: 'stream',
    });
    console.log('DEBUG: imageStream', imageStream);
    const formData = new FormData();
    formData.append('image', imageStream);
    const { data: processedImageStream } = await axios.post(
      'https://face.bubble.ru/_api/face',
      formData,
      { responseType: 'stream' },
    );
    console.log('DEBUG: processedImageStream', processedImageStream);
    ctx.replyWithPhoto(processedImageStream);
  } catch (err) {
    logger.error(err);
  }
});

const launch = async (): Promise<void> => {
  logger.info('release -', app.release);

  if (app.isWebhookDisabled) {
    await bot.telegram.deleteWebhook();
    bot.startPolling();
  } else {
    let host: string;
    if (app.env === 'development') {
      host = await ngrok.connect(app.webhookPort);
    } else {
      host = app.webhookHost;
    }

    const hookPath = `/bots/telegram/${crypto.randomBytes(32).toString('hex')}`;

    await bot.launch({
      webhook: {
        domain: host,
        hookPath,
        port: app.webhookPort,
      },
    });
  }

  logger.info('bot - online');
};

launch()
  .then((): void => logger.info('all systems nominal'))
  .catch((err: Error): void => {
    logger.error('bot - offline');
    logger.error(err);
  });
