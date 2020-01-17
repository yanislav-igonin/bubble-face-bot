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
    'Кидай фотку и балдей',
  );
});

bot.on('photo', async (ctx: ContextMessageUpdate): Promise<void> => {
  try {
    // @ts-ignore
    const { photo } = ctx.update.message;
    const fileId = photo[photo.length - 1].file_id;
    const fileLink = await telegram.getFileLink(fileId);

    const originalImageResponse = await axios({
      method: 'GET',
      responseType: 'stream',
      url: fileLink,
    });

    const formData = new FormData();
    formData.append('image', originalImageResponse.data);

    const headers = formData.getHeaders();

    const processedImageResponse = await axios({
      method: 'post',
      url: 'https://face.bubble.ru/_api/face',
      responseType: 'stream',
      headers,
      data: formData,
    });

    ctx.replyWithPhoto({ source: processedImageResponse.data });
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
