DROP TABLE weathers, meetups, locations;

CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude NUMERIC(8, 6),
    longitude NUMERIC(9, 6)
);

CREATE TABLE IF NOT EXISTS weathers (
    id SERIAL PRIMARY KEY,
    forecast VARCHAR(255),
    time VARCHAR(255),
    location_id INTEGER NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations (id)
);

CREATE TABLE IF NOT EXISTS meetups (
    id SERIAL PRIMARY KEY,
    link VARCHAR(255),
    name VARCHAR(255),
    creation_date CHAR(15),
    host VARCHAR(255),
    location_id INTEGER NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations (id)
);

-- CREATE TABLE IF NOT EXISTS yelps (
--   id SERIAL PRIMARY KEY,
--   url VARCHAR(255),
--   name VARCHAR(255),
--   rating VARCHAR(255),
--   price VARCHAR(255),
--   image_url VARCHAR(255),
--   location_id INTEGER NOT NULL,
--   FOREIGN KEY (location_id) REFERENCES locations (id)
-- );

CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  released_on VARCHAR(255),
  total_votes VARCHAR(255),
  average_votes VARCHAR(255),
  popularity VARCHAR(255),
  image_url VARCHAR(255),
  overview TEXT,
  location_id INTEGER NOT NULL,
  FOREIGN KEY (location_id) REFERENCES locations (id)
);

CREATE TABLE trails(
  id SERIAL PRIMARY KEY,
  trail_url VARCHAR(255),
  name VARCHAR(255),
  location VARCHAR(255),
  length NUMERIC (3,1),
  condition_date VARCHAR(255),
  condition_time VARCHAR(255),
  conditions VARCHAR(255),
  stars NUMERIC(2,1),
  star_votes NUMERIC(4,0),
  summary TEXT,
  location_id INTEGER NOT NULL,
  FOREIGN KEY (location_id) REFERENCES locations (id)
);