import { Client } from 'pg';
import { config } from 'dotenv';

config();

export const getConnection = async () => {
  const client = new Client({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBUSER,
    port: Number(process.env.DBPORT),
  });
  await client.connect();
  return client;
};
