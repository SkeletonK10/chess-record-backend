import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBUSER,
    port: Number(process.env.DBPORT),
})

export const getConnection = async () => {
  const client = await pool.connect();
  return client;
};
