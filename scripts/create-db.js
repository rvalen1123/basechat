import pg from "pg";
const { Client } = pg;

async function createDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    await client.query("CREATE DATABASE basechat");
    console.log("Database created successfully");
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }
}

createDatabase();
