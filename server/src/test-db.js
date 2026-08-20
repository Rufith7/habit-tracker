require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testDatabase() {
  try {
    await client.connect();

    const result = await client.query("SELECT NOW()");

    console.log("✅ Database connected");
    console.log("Database time:", result.rows[0].now);
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error.message);
  } finally {
    await client.end().catch(() => {});
  }
}

testDatabase();