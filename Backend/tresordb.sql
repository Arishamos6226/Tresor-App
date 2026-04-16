DROP DATABASE IF EXISTS tresordb;
CREATE DATABASE tresordb;
USE tresordb;

CREATE USER IF NOT EXISTS 'tresoruser'@'%' IDENTIFIED BY 'tresorpassword';
GRANT ALL PRIVILEGES ON tresordb.* TO 'tresoruser'@'%';
FLUSH PRIVILEGES;

CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password LONGTEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE secret (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    salt VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `password`) VALUES
(1, 'Hans', 'Muster', 'hans.muster@bbw.ch', '$2y$12$IYKTUF3YeQSBKt3t0r..IO8NgPAj.n7Rbx4uTCrh9Bpxiyoq1/SUC'),
(2, 'Paula', 'Kuster', 'paula.kuster@bbw.ch', '$2y$12$4swKo4tzpRemKVOkBfHETeQDutDX.vy1jo3kQf..4hKlfZ/6YCBgK'),
(3, 'Andrea', 'Oester', 'andrea.oester@bbw.ch', '$2y$12$20zjlksx24bpHs808MyZHO6GASwrUHLileD1zzr8xOVA0Qz8.0wEe');

INSERT INTO `secret` (`id`, `user_id`, `content`) VALUES
    (1, 1, '{"kindid":1,"kind":"credential","userName":"muster","password":"1234","url":"www.bbw.ch"}'),
    (2, 1, '{"kindid":2,"kind":"creditcard","cardtype":"Visa","cardnumber":"4242 4242 4242 4241","expiration":"12/27","cvv":"789"}'),
    (3, 1, '{"kindid":3,"kind":"note","title":"Eragon","content":"Und Eragon ging auf den Drachen zu."}');
