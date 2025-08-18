import Redis from "ioredis";
import { REDIS_HOST,REDIS_PASSWORD,REDIS_PORT, REDIS_URL, REDIS_USERNAME } from "../config";

console.log("Redis Connection Details:");
console.log("-------------------------");
console.log("Host:", REDIS_HOST);
console.log("Port:", REDIS_PORT);
console.log("Username:", REDIS_USERNAME ? "Set" : "Not set");
console.log("Password:", REDIS_PASSWORD ? "Set" : "Not set");
console.log("Redis URL:", REDIS_URL ? "Set" : "Not set");
console.log("-------------------------");

let redis: Redis;

if (REDIS_URL) {
    console.log("Attempting to connect using Redis URL...");
    redis = new Redis(REDIS_URL, {
  
        tls: {
            rejectUnauthorized: false,
            servername: REDIS_HOST
        },

        connectTimeout: 10000,
        lazyConnect: true,
        keepAlive: 30000,

        retryStrategy(times: number) {
            if (times > 10) {
                console.log("❌ Redis: Max retries reached, stopping...");
                return null;
            }
            const delay = Math.min(times * 2000, 10000);
            console.log(`Redis connection attempt ${times} failed. Retrying in ${delay}ms...`);
            return delay;
        },
        maxRetriesPerRequest: 3,
        family: 4
    });
} else {
    console.log("Connecting with individual parameters...");
    redis = new Redis({
        host: REDIS_HOST,
        port: Number(REDIS_PORT),
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD,
        tls: {
            rejectUnauthorized: false,
            servername: REDIS_HOST
        },
        connectTimeout: 10000,
        lazyConnect: true,
        keepAlive: 30000,
        retryStrategy(times: number) {
            if (times > 10) {
                console.log("❌ Redis: Max retries reached, stopping...");
                return null;
            }
            const delay = Math.min(times * 2000, 10000);
            console.log(`Redis connection attempt ${times} failed. Retrying in ${delay}ms...`);
            return delay;
        },
        maxRetriesPerRequest: 3,
        family: 4
    });
}


redis.on("connect", () => {
    console.log("✅ Connected to Redis successfully");
});

redis.on("ready", () => {
    console.log("✅ Redis client is ready to use");
});

redis.on("error", (err: Error) => {
    console.error("❌ Redis Error:", err.message);

    if (!err.message.includes('ECONNRESET')) {
        console.error("Error details:", err);
    }
});

redis.on("close", () => {
    console.log("⚠️ Redis connection closed");
});

redis.on("reconnecting", (ms: number) => {
    console.log(`⏳ Redis reconnecting in ${ms}ms...`);
});

redis.on("end", () => {
    console.log("🔴 Redis connection ended");
});


(async () => {
    try {
        console.log("🔄 Testing Redis connection...");
        await redis.connect();
        const pong = await redis.ping();
        console.log("🟢 Redis ping successful:", pong);
        
        await redis.set("test:connection", "ok", "EX", 10);
        const testValue = await redis.get("test:connection");
        console.log("🟢 Redis test operation successful:", testValue);
        
    } catch (error:any) {
        console.error("🔴 Redis connection test failed:");
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        
        console.log("\n💡 Troubleshooting suggestions:");
        console.log("1. Check if your Upstash Redis instance is active");
        console.log("2. Verify your Redis credentials in .env file");
        console.log("3. Check if your IP is whitelisted (if applicable)");
        console.log("4. Try connecting from a different network");
    }
})();

export default redis;