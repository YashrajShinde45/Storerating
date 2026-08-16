const pool = require("../config/db");

const getDashboardCounts = async () => {
  const usersCount = await pool.query("SELECT COUNT(*) FROM users");
  const storesCount = await pool.query("SELECT COUNT(*) FROM stores");
  const ratingsCount = await pool.query("SELECT COUNT(*) FROM ratings");

  return {
    users: parseInt(usersCount.rows[0].count, 10),
    stores: parseInt(storesCount.rows[0].count, 10),
    ratings: parseInt(ratingsCount.rows[0].count, 10),
  };
};

const createAdminUser = async ({
  name,
  email,
  password,
  address,
  role,
}) => {
  const result = await pool.query(
    `INSERT INTO users
    (name, email, password, address, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, address, role`,
    [name, email, password, address, role]
  );

  return result.rows[0];
};

const getUsers = async ({
  search = "",
  role = "",
  sort = "name",
  order = "ASC",
} = {}) => {
  const allowedSort = ["name", "email", "address", "role"];
  const sortField = allowedSort.includes(sort) ? sort : "name";
  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const result = await pool.query(
    `
    SELECT id, name, email, address, role
    FROM users
    WHERE
      ($1='' OR name ILIKE '%'||$1||'%'
      OR email ILIKE '%'||$1||'%'
      OR address ILIKE '%'||$1||'%')
      AND ($2='' OR role=$2)
    ORDER BY ${sortField} ${sortOrder}
    `,
    [search, role]
  );

  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id,name,email,address,role
     FROM users
     WHERE id=$1`,
    [id]
  );

  return result.rows[0];
};

const createStore = async ({
  owner_id,
  name,
  email,
  address,
}) => {
  const result = await pool.query(
    `INSERT INTO stores
    (owner_id,name,email,address)
    VALUES($1,$2,$3,$4)
    RETURNING *`,
    [owner_id, name, email, address]
  );

  return result.rows[0];
};

const getStores = async ({
  search = "",
  sort = "name",
  order = "ASC",
} = {}) => {
  const allowedSort = ["name", "email", "address"];
  const sortField = allowedSort.includes(sort) ? sort : "name";
  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const result = await pool.query(
    `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      COALESCE(AVG(r.rating),0) AS rating
    FROM stores s
    LEFT JOIN ratings r
      ON s.id=r.store_id
    WHERE
      ($1='' OR s.name ILIKE '%'||$1||'%'
      OR s.address ILIKE '%'||$1||'%')
    GROUP BY s.id
    ORDER BY ${sortField} ${sortOrder}
    `,
    [search]
  );

  return result.rows;
};

module.exports = {
  getDashboardCounts,
  createAdminUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
};
