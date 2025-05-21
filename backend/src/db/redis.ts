import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();


console.log("Redis Connection Details:");
console.log("-------------------------");
console.log("Host:", process.env.REDIS_HOST);
console.log("Port:", process.env.REDIS_PORT);
console.log("Username:", process.env.REDIS_USERNAME ? "Set" : "Not set");
console.log("Password:", process.env.REDIS_PASSWORD ? "Set" : "Not set");
console.log("Redis URL:", process.env.REDIS_URL ? "Set" : "Not set");
console.log("-------------------------");


let redis: Redis;

if (process.env.REDIS_URL) {
    console.log("Attempting to connect using Redis URL...");
    redis = new Redis(process.env.REDIS_URL, {
        tls: {
            rejectUnauthorized: false,
        },
        retryStrategy(times: number) {
            const delay = Math.min(times * 1000, 5000);
            console.log(`Redis connection attempt ${times} failed. Retrying in ${delay}ms...`);
            return delay;
        },
    });
} else {
    console.log("Connecting with individual parameters...");
    const redisOptions = {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        tls: {
            //  TLS/SSL for secure connections
            rejectUnauthorized: false, 
        },
        retryStrategy(times: number) {
            const delay = Math.min(times * 1000, 5000);
            console.log(`Redis connection attempt ${times} failed. Retrying in ${delay}ms...`);
            return delay;
        },
        maxRetriesPerRequest: 3
    };

    redis = new Redis(redisOptions);
}


redis.on("connect", () => {
    console.log("✅ Connected to Redis successfully");
});

redis.on("ready", () => {
    console.log("✅ Redis client is ready to use");
});

redis.on("error", (err: Error) => {
    console.error("❌ Redis Error:", err);
    console.error("Error stack:", err.stack);
});

redis.on("close", () => {
    console.log("⚠️ Redis connection closed");
});

redis.on("reconnecting", () => {
    console.log("⏳ Redis reconnecting...");
});


(async () => {
    try {
        await redis.ping();
        console.log("🟢 Redis ping successful!");
    } catch (error) {
        console.error("🔴 Redis ping failed:", error);
    }
})();

export default redis; 