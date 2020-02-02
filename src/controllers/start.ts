import { ContextMessageUpdate } from 'telegraf';

export default async (ctx: ContextMessageUpdate): Promise<void> => {
  await ctx.reply(
    'Кидай фотку и балдей',
  );
};
