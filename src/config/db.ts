import mySql2 from "mysql2/promise";

import { drizzle } from "drizzle-orm/mysql2";

const Pool = mySql2.createPool({
  uri: process.env.DATABASE_URL as string,
});
const db = drizzle(Pool);
export default db;
