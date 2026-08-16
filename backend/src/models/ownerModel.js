const pool = require("../config/db");

const getOwnerDashboard = async (ownerId) => {
  const result = await pool.query(
    `
    SELECT
      s.id,
      s.name,
      s.address,
      ROUND(COALESCE(AVG(r.rating),0),1) AS average_rating
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    WHERE s.owner_id = $1
    GROUP BY s.id
    `,
    [ownerId]
  );

  return result.rows;
};

const getRatingUsers = async (ownerId) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      r.rating,
      s.name AS store_name
    FROM ratings r
    JOIN users u
      ON r.user_id = u.id
    JOIN stores s
      ON r.store_id = s.id
    WHERE s.owner_id = $1
    ORDER BY r.rating DESC
    `,
    [ownerId]
  );

  return result.rows;
};

const updateOwnerPassword = async (ownerId, hashedPassword) => {
  await pool.query(
    `
    UPDATE users
    SET password = $2
    WHERE id = $1
    `,
    [ownerId, hashedPassword]
  );
};

module.exports = {
  getOwnerDashboard,
  getRatingUsers,
  updateOwnerPassword,
};
