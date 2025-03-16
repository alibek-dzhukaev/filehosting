import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // postgres validation
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  // migrations validation
  RUN_MIGRATIONS: Joi.string().default('0'),
  // redis validation
  REDIS_HOST: Joi.string().default('redis'),
  REDIS_PORT: Joi.string().default(6379),
  // jwt validation
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.string().required(),
  // throttle validation
  THROTTLER_TTL: Joi.string().required(),
  THROTTLER_LIMIT: Joi.string().required(),

  API_KEY: Joi.string().required(),
  API_URL: Joi.string().uri().required(),
  PORT: Joi.string().required(),
});
