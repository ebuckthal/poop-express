CREATE TABLE users (
   id INT NOT NULL AUTO_INCREMENT,
   username VARCHAR(20) UNIQUE,
   email VARCHAR(50) NOT NULL UNIQUE,
   hashed_password VARCHAR(60) NOT NULL,
   PRIMARY KEY (id)
);

CREATE TABLE puzzles (
   id INT NOT NULL AUTO_INCREMENT,
   description VARCHAR(100),
   puzzle_size INT NOT NULL,
   puzzle TEXT NOT NULL,
   PRIMARY KEY (id)
);


