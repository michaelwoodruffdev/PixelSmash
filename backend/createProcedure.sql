DELIMITER $$
CREATE PROCEDURE getFriends(
IN currentUser int)

BEGIN

select user.username from user
join friend on user.iduser = friend.friend
where friend.user = currentUser;

END$$

DELIMITER;

DELIMITER $$
CREATE PROCEDURE getUserID(
IN currentUser varchar(45))

BEGIN

select iduser from user where user.username = currentUser;

END$$

DELIMITER;
