CREATE USER 'eric'@'localhost' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON * . * TO 'eric'@'localhost';
FLUSH PRIVILEGES;
CREATE TABLE pooptest;
