CREATE TABLE `user` (
  `iduser` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL UNIQUE,
  `firstname` VARCHAR(45) NOT NULL,
  `surname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`iduser`));


CREATE TABLE `pixel`.`friend` (
  `user` INT NOT NULL,
  `friend` INT NOT NULL,
  PRIMARY KEY (`user`, `friend`),
  CONSTRAINT `user`
    FOREIGN KEY (`user`)
    REFERENCES `pixel`.`user` (`iduser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `friend`
    FOREIGN KEY (`friend`)
    REFERENCES `pixel`.`user` (`iduser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
