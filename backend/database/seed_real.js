const pool = require("../src/config/db");
const bcrypt = require("bcrypt");

async function seed() {
  try {
    const defaultPass = await bcrypt.hash("Password123!", 10);
    const adminPass = defaultPass;
    const ownerPass = defaultPass;
    const userPass = defaultPass;

    // Upsert admin
    const adminRes = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ('System Administrator User', 'admin@example.com', $1, '789 Executive Plaza', 'admin')
       ON CONFLICT (email) DO UPDATE SET password = $1, name = 'System Administrator User'
       RETURNING id, name, email, role`,
      [adminPass]
    );
    console.log("Admin ready:", adminRes.rows[0]);

    // Upsert owner
    const ownerRes = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ('Store Owner Specialist', 'owner@example.com', $1, '456 Commercial Street', 'owner')
       ON CONFLICT (email) DO UPDATE SET password = $1, name = 'Store Owner Specialist'
       RETURNING id, name, email, role`,
      [ownerPass]
    );
    const owner = ownerRes.rows[0];
    console.log("Owner ready:", owner);

    // Upsert user
    const userRes = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ('Johnathan Customer Doe', 'user@example.com', $1, '123 Residential Lane', 'user')
       ON CONFLICT (email) DO UPDATE SET password = $1, name = 'Johnathan Customer Doe'
       RETURNING id, name, email, role`,
      [userPass]
    );
    console.log("User ready:", userRes.rows[0]);

    // Insert sample stores if none exist
    const storesCount = await pool.query("SELECT count(*) FROM stores");
    if (parseInt(storesCount.rows[0].count, 10) === 0) {
      await pool.query(
        `INSERT INTO stores (owner_id, name, email, address)
         VALUES 
           ($1, 'Metro Fresh Supermarket', 'metrofresh@stores.com', '101 Market Street, Central City'),
           ($1, 'Apex Electronics & Gadgets', 'apex@stores.com', '202 Tech Boulevard, Silicon Hub')`,
        [owner.id]
      );
      console.log("Sample stores seeded into database");
    }

    console.log("Seeding complete successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
