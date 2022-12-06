import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

export const redis = new Redis(6379, "localhost");

export const pubsub = new RedisPubSub({
  publisher: redis,
  subscriber: redis,
});
