DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
  familyID int PRIMARY KEY,
  familyName VARCHAR(30),
  email VARCHAR(30),
  pass VARCHAR(30),
  numPets int
);


CREATE TABLE IF NOT EXISTS pets(
  petID int PRIMARY KEY,
  familyID int,
  pet_name varchar(30),
  pet_type varchar(30),
  currentWeight int,
  age int,
  timesToFeed int,
  CONSTRAINT fk_user
    FOREIGN KEY(familyID)
      REFERENCES users(familyID)
);

INSERT INTO users(familyID, familyName, email, pass, numPets)
VALUES(121, 'Ralph', '1234@colorado.edu', 'Password1', 1),
(123, 'Smith', 'aydensmitty1@gmail.com', 'Password2', 1);

INSERT INTO pets(petID, familyID, pet_name, pet_type, currentWeight, age, timesToFeed)
VALUES(1231, 123, 'Max', 'Dog', 60, 4, 3),
(1233, 121, 'Mat', 'Rat', 1, 2, 2)