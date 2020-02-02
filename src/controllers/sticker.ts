import { ContextMessageUpdate } from 'telegraf';
import axios from 'axios';
import FormData from 'form-data';
import { logger, telegram } from '../modules';
import { app } from '../config';

export default async (ctx: ContextMessageUpdate): Promise<void> => {
  try {
    if (app.imaginaryHost === '') {
      return;
    }

    // @ts-ignore Sticker is exist for this controller
    const { sticker } = ctx.update.message;

    if (sticker.is_animated) {
      await ctx.reply('Извини, анимированные стикеры не поддерживаются');
      return;
    }

    const fileId = sticker.file_id;
    const fileLink = await telegram.getFileLink(fileId);

    const originalImageResponse = await axios({
      method: 'GET',
      responseType: 'stream',
      url: fileLink,
    });

    const convertFormData = new FormData();
    convertFormData.append('file', originalImageResponse.data);
    const convertHeaders = convertFormData.getHeaders();
    const convertedImageResponse = await axios({
      method: 'post',
      url: `http://${app.imaginaryHost}/convert?type=png`,
      responseType: 'stream',
      headers: { ...convertHeaders, 'API-Key': app.imaginaryApiKey },
      data: convertFormData,
    });

    const processFormData = new FormData();
    processFormData.append('image', convertedImageResponse.data);
    const processHeaders = processFormData.getHeaders();
    const processedImageResponse = await axios({
      method: 'post',
      url: 'https://face.bubble.ru/_api/face',
      responseType: 'stream',
      headers: processHeaders,
      data: processFormData,
    });

    await ctx.replyWithPhoto({ source: processedImageResponse.data });
  } catch (err) {
    logger.error(err);
  }
};
