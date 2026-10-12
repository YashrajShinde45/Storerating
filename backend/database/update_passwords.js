const pool = require("../src/config/db");
const bcrypt = require("bcrypt");

async function fixPasswords() {
  try {
    const password = "Password123!";
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query("UPDATE users SET password = $1", [hash]);
    console.log(`Updated ${result.rowCount} users with password: ${password}`);

    const users = await pool.query("SELECT id, name, email, role FROM users ORDER BY id ASC");
    console.log("Users in DB:");
    users.rows.forEach((u) => {
      console.log(`- ID: ${u.id} | Email: ${u.email} | Role: ${u.role} | Password: ${password}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Error updating passwords:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixPasswords();
