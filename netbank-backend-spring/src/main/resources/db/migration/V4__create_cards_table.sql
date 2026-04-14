CREATE TYPE card_type_enum AS ENUM ('PHYSICAL', 'VIRTUAL');

CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL,
    card_number VARCHAR(19) NOT NULL UNIQUE,
    expiration_date VARCHAR(255) NOT NULL,
    cvv VARCHAR(4) NOT NULL,
    is_locked BOOLEAN NOT NULL DEFAULT false,
    card_type card_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_card_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);
