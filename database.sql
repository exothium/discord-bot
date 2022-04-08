DROP TABLE IF EXISTS `liked_tweets`;

CREATE TABLE `liked_tweets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) NOT NULL,
  `tweet_id` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `tokens`;

CREATE TABLE `tokens` (
  `id` int NOT NULL,
  `operation` varchar(45) NOT NULL,
  `token` varchar(45) NOT NULL,
  `tweet_id` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `tweets`;

CREATE TABLE `tweets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tweet_id` varchar(45) NOT NULL,
  `retweet_count` int NOT NULL,
  `reply_count` int NOT NULL,
  `like_count` int NOT NULL,
  `quote_count` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
