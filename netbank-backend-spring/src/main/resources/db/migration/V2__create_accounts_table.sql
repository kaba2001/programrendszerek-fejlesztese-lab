CREATE TYPE account_currency AS ENUM ('HUF', 'EUR', 'USD');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'FROZEN', 'CLOSED');

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    account_number VARCHAR(255) NOT NULL UNIQUE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency account_currency NOT NULL DEFAULT 'HUF',
    status account_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
