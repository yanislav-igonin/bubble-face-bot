import { ContextMessageUpdate } from 'telegraf';
import axios from 'axios';
import FormData from 'form-data';
import { logger, telegram } from '../modules';

export default async (ctx: ContextMessageUpdate): Promise<void> => {
  try {
    // @ts-ignore Sticker is exist for this controller
    const { sticker } = ctx.update.message;
    const fileId = sticker.file_id;
    const fileLink = await telegram.getFileLink(fileId);

    if (sticker.is_animated) {
      await ctx.reply('Извини, анимированные стикеры не поддерживаются');
      return;
    }

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

    await ctx.replyWithSticker({ source: processedImageResponse.data });
  } catch (err) {
    logger.error(err);
  }
};
