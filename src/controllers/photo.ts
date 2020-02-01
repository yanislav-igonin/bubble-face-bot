import { Telegram, ContextMessageUpdate } from 'telegraf';
import axios from 'axios';
import FormData from 'form-data';
import { app } from '../config';
import { logger } from '../modules';

const telegram = new Telegram(app.botToken);

export default async (ctx: ContextMessageUpdate): Promise<void> => {
  try {
    // @ts-ignore Photo is exist for this controller
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
};
