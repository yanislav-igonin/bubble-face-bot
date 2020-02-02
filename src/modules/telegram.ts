import { Telegram } from 'telegraf';
import { app } from '../config';

const telegram = new Telegram(app.botToken);

export default telegram;
