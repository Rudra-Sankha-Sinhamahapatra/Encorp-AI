import dotenv from "dotenv"
dotenv.config()

export const PORT = process.env.PORT || 8000
export const DATABASE_URL = process.env.DATABASE_URL || ""
export const JWT_SECRET = process.env.JWT_SECRET || "hsjhssh"
export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"
export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
export const REDIS_USERNAME = process.env.REDIS_USERNAME