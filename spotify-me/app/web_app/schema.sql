DROP TABLE IF EXISTS users;


CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  spotify_id INTEGER UNIQUE,
  full_name TEXT NOT NULL,
  display_image TEXT
);