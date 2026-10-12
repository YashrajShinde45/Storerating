const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
    [email]
  );

  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, address, role, created_at FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

const createUser = async ({
  name,
  email,
  password,
  address,
  role,
}) => {
  const result = await pool.query(
    `INSERT INTO users
    (name,email,password,address,role)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id,name,email,address,role,created_at`,
    [name, email, password, address, role]
  );

  return result.rows[0];
};

const updateUserProfile = async (id, { name, address }) => {
  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         address = COALESCE($2, address)
     WHERE id = $3
     RETURNING id, name, email, address, role, created_at`,
    [name, address, id]
  );

  return result.rows[0];
};

const updateUserPassword = async (id, hashedPassword) => {
  await pool.query(
    "UPDATE users SET password = $1 WHERE id = $2",
    [hashedPassword, id]
  );
};

const getUserStats = async (userId, role) => {
  if (role === "admin") {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users)::int AS total_users,
        (SELECT COUNT(*) FROM stores)::int AS total_stores,
        (SELECT COUNT(*) FROM ratings)::int AS total_ratings
    `);
    return stats.rows[0];
  } else if (role === "owner") {
    const stats = await pool.query(
      `SELECT
        COUNT(DISTINCT s.id)::int AS stores_count,
        COUNT(r.id)::int AS ratings_received,
        ROUND(COALESCE(AVG(r.rating), 0), 1)::numeric AS average_store_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1`,
      [userId]
    );
    return stats.rows[0];
  } else {
    // Normal user
    const stats = await pool.query(
      `SELECT
        COUNT(*)::int AS ratings_count,
        ROUND(COALESCE(AVG(rating), 0), 1)::numeric AS average_rating_given
      FROM ratings
      WHERE user_id = $1`,
      [userId]
    );
    return stats.rows[0];
  }
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
  updateUserPassword,
  getUserStats,
};