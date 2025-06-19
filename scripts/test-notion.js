const { Client } = require("@notionhq/client");
require("dotenv").config({ path: ".env.local" });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function testNotionConnection() {
  console.log("🔍 Testing Notion API connection...");
  console.log("Token:", process.env.NOTION_TOKEN ? "Found" : "Missing");
  console.log(
    "Database ID:",
    process.env.NOTION_DATABASE_ID ? "Found" : "Missing"
  );

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 5, // Just test with 5 entries
    });

    console.log("✅ Connection successful!");
    console.log(`📊 Found ${response.results.length} entries in database`);

    if (response.results.length > 0) {
      const firstEntry = response.results[0];
      console.log("\n📄 First entry properties:");
      Object.keys(firstEntry.properties).forEach((key) => {
        console.log(`  - ${key}: ${firstEntry.properties[key].type}`);
      });
    }
  } catch (error) {
    console.error("❌ Connection failed:", error.message);

    if (error.code === "object_not_found") {
      console.error("🚨 Database not found. Please check your DATABASE_ID");
    } else if (error.code === "unauthorized") {
      console.error("🚨 Unauthorized. Please check your NOTION_TOKEN");
    }
  }
}

testNotionConnection();
