CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  loan_type VARCHAR(50) NOT NULL DEFAULT 'personal',
  loan_name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255),
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  remaining_amount DECIMAL(15,2),
  interest_rate DECIMAL(5,2),
  monthly_payment DECIMAL(15,2),
  currency VARCHAR(10) NOT NULL DEFAULT 'SEK',
  start_date DATE,
  end_date DATE,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
