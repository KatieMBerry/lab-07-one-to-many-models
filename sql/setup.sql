DROP TABLE IF EXISTS alpaca_walkers CASCADE;
DROP TABLE IF EXISTS alpacas;

CREATE TABLE alpaca_walkers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    energy_level TEXT NOT NULL,
    years_of_experience INTEGER CHECK (years_of_experience > 0)
);

-- alpacas will reference our walkers
CREATE TABLE alpacas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    disposition TEXT,
    walker_id BIGINT REFERENCES alpaca_walkers(id)
);