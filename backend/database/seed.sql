USE store_rating_platform;

INSERT INTO users (
    name,
    email,
    password,
    address,
    role
)
VALUES (
    'System Administrator',
    'admin@example.com',
    '$2b$10$placeholderhashedpassword',
    'Head Office',
    'admin'
);

