interface AppConfig {
  env: string;
  botToken: string;
  release: string;
  webhookHost: string;
  webhookPort: number;
  isWebhookDisabled: boolean;
}

const app: AppConfig = {
  env: process.env.NODE_ENV || 'development',
  botToken: process.env.BOT_TOKEN || '',
  release: process.env.CI_COMMIT_TAG || 'development',
  webhookHost: process.env.WEBHOOK_HOST || '',
  webhookPort: process.env.WEBHOOK_PORT
    ? parseInt(process.env.WEBHOOK_PORT, 10)
    : 8000,
  isWebhookDisabled: process.env.IS_WEBHOOK_DISABLED === 'true',
};

export default app;
