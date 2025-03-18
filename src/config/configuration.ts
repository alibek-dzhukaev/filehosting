export default () => ({
  database: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
  api: {
    port: process.env.PORT,
    key: process.env.API_KEY,
    url: process.env.API_URL,
    globalPrefix: process.env.GLOBAL_PREFIX,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expireIn: process.env.JWT_EXPIRE,
    cookieName: process.env.JWT_COOKIE,
  },
  throttle: {
    ttl: process.env.THROTTLER_TTL,
    limit: process.env.THROTTLER_LIMIT,
  },

  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
});
