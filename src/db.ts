import { Client } from 'pg';

import config from './dbconfig';

export const getConnection = async () => {
  const client = new Client(config);
  await client.connect();
  return client;
};
