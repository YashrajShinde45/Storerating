const pool = require("../config/db");

const getStores = async (userId, search = "") => {
  const result = await pool.query(
    `
    SELECT
      s.id,
      s.name,
      s.address,
      s.email,
      COALESCE(AVG(r.rating), 0) AS rating,
      ur.rating AS user_rating
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    LEFT JOIN ratings ur
      ON s.id = ur.store_id AND ur.user_id = $1
    WHERE
      ($2 = '' OR s.name ILIKE '%'||$2||'%' OR s.address ILIKE '%'||$2||'%')
    GROUP BY s.id, ur.rating
    ORDER BY s.name ASC
    `,
    [userId, search]
  );

  return result.rows;
};

const getUserRating = async (userId, storeId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM ratings
    WHERE user_id=$1
    AND store_id=$2
    `,
    [userId, storeId]
  );

  return result.rows[0];
};

const addRating = async (userId, storeId, rating) => {
  const result = await pool.query(
    `
    INSERT INTO ratings
    (user_id,store_id,rating)
    VALUES($1,$2,$3)
    RETURNING *
    `,
    [userId, storeId, rating]
  );

  return result.rows[0];
};

const updateRating = async (userId, storeId, rating) => {
  const result = await pool.query(
    `
    UPDATE ratings
    SET rating=$3,
        updated_at=CURRENT_TIMESTAMP
    WHERE user_id=$1
    AND store_id=$2
    RETURNING *
    `,
    [userId, storeId, rating]
  );

  return result.rows[0];
};

const updatePassword = async (userId, hashedPassword) => {
  await pool.query(
    `
    UPDATE users
    SET password=$2
    WHERE id=$1
    `,
    [userId, hashedPassword]
  );
};

module.exports = {
  getStores,
  getUserRating,
  addRating,
  updateRating,
  updatePassword,
};
