CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(60) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    address VARCHAR(400),

    role VARCHAR(20) NOT NULL
        CHECK(role IN ('admin','user','owner')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id SERIAL PRIMARY KEY,

    owner_id INTEGER NOT NULL,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE,

    address VARCHAR(400),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_owner
        FOREIGN KEY(owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    store_id INTEGER NOT NULL,

    rating INTEGER NOT NULL
        CHECK(rating BETWEEN 1 AND 5),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_store
        FOREIGN KEY(store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_store
        UNIQUE(user_id, store_id)
);