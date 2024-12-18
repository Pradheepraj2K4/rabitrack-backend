import { createPool } from "mysql2/promise";
import { config } from "dotenv";
config();


export const db = createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port : process.env.DB_PORT,
});
