interface AppConfig {
  env: string;
  botToken: string;
  release: string;
  webhookHost: string;
  webhookPort: number;
  webhookPath: string;
  isWebhookDisabled: boolean;
  imaginaryHost: string;
  imaginaryApiKey: string;
}

const app: AppConfig = {
  env: process.env.NODE_ENV || 'development',
  botToken: process.env.BOT_TOKEN || '',
  release: process.env.CI_COMMIT_TAG || 'development',
  webhookHost: process.env.WEBHOOK_HOST || '',
  webhookPort: process.env.WEBHOOK_PORT
    ? parseInt(process.env.WEBHOOK_PORT, 10)
    : 8000,
  webhookPath: process.env.WEBHOOK_PATH || '',
  isWebhookDisabled: process.env.IS_WEBHOOK_DISABLED === 'true',
  imaginaryHost: process.env.IMAGINARY_HOST || '',
  imaginaryApiKey: process.env.IMAGINARY_API_KEY || '',
};

export default app;
