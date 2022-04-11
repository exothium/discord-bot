/*
 Navicat Premium Data Transfer

 Source Server         : Exothium
 Source Server Type    : MySQL
 Source Server Version : 50505
 Source Host           : localhost
 Source Database       : discord

 Target Server Type    : MySQL
 Target Server Version : 50505
 File Encoding         : utf-8

 Date: 04/11/2022 14:06:39 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `liked_tweets`
-- ----------------------------
DROP TABLE IF EXISTS `liked_tweets`;
CREATE TABLE `liked_tweets` (
  `id` varchar(36) DEFAULT NULL,
  `user_id` varchar(45) NOT NULL,
  `tweet_id` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`,`tweet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `tokens`
-- ----------------------------
DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `operation` varchar(45) NOT NULL,
  `token` varchar(45) NOT NULL,
  `tweet_id` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `tweets`
-- ----------------------------
DROP TABLE IF EXISTS `tweets`;
CREATE TABLE `tweets` (
  `id` varchar(36) DEFAULT NULL,
  `tweet_id` varchar(45) NOT NULL,
  `retweet_count` int(11) NOT NULL,
  `reply_count` int(11) NOT NULL,
  `like_count` int(11) NOT NULL,
  `quote_count` int(11) NOT NULL,
  PRIMARY KEY (`tweet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Triggers structure for table liked_tweets
-- ----------------------------
DROP TRIGGER IF EXISTS `liked_tweets_guid`;
delimiter ;;
CREATE TRIGGER `liked_tweets_guid` BEFORE INSERT ON `liked_tweets` FOR EACH ROW BEGIN
IF(NEW.id IS NULL) THEN SET NEW.id = UUID();
END IF;
END
 ;;
delimiter ;

delimiter ;;
-- ----------------------------
--  Triggers structure for table tweets
-- ----------------------------
 ;;
delimiter ;
DROP TRIGGER IF EXISTS `tweet_guid`;
delimiter ;;
CREATE TRIGGER `tweet_guid` BEFORE INSERT ON `tweets` FOR EACH ROW BEGIN
IF(NEW.id IS NULL) THEN SET NEW.id = UUID();
END IF;
END
 ;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
