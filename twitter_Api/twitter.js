const { default: axios } = require("axios");
const db = require("./database/connection");
const { formatLikesArray, formatTweetsArray } = require("./assets/assets");
const config = require("../config.json");

const twitterToken = config.TWITTER_TOKEN;

/*
    This function will return the user object
    If the user does not exist, it will return undefined
*/

const getUser = async (username) => {
    let res_error = false
    let user

    // Get the userid
    await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
        headers: {
            Authorization: `Bearer ${twitterToken}`
        }
    }).then((res) => user = res.data.data)
        .catch((err) => {
            if (err.response) {
                res_error = true
            }
        })

    // Check in the Database how many posts the user has liked 
    if (res_error) {
        console.log("Currently not able to make requests")
    }

    return user
}

/*
    This function will return the number of posts that the user liked 
*/
const userLikes = async (userId) => {
    const result = await executeQueries(`SELECT * FROM liked_tweets WHERE user_id = ${userId}`)

    if (result.length > 0) {
        return result.length
    }
    return 0
}

/*
    This function will get all the tweets from a specific page
*/
const getTweets = async (pageId) => {
    let responsesTweets = []

    let tweets_hasNextPage = false
    let tweets_next_PageToken

    // Get the firt 100 tweets (Twitter API is limited to 100 per request)
    await axios.get(`https://api.twitter.com/2/users/${pageId}/tweets`, {
        headers: {
            Authorization: `Bearer ${twitterToken}`
        },
        params: {
            max_results: 100,
            "tweet.fields": "public_metrics"
        }
    }).then((res) => {
        if (res.data.meta.result_count > 0) {
            responsesTweets.push(res.data.data)

            if (res.data.meta.next_token) {
                tweets_hasNextPage = true
                tweets_next_PageToken = res.data.meta.next_token
            }
        }
    }).catch((err) => {
        if (err.response) {
            tweets_hasNextPage = false
        }
    })

    // If the response has "next_token" field, it means we have to keep getting all the tweets until the field is gone
    while (tweets_hasNextPage) {
        await axios.get(`https://api.twitter.com/2/users/${pageId}/tweets`, {
            headers: {
                Authorization: `Bearer ${twitterToken}`
            },
            params: {
                max_results: 100,
                "tweet.fields": "public_metrics",
                pagination_token: next_pageToken
            }
        }).then((res) => {
            if (res.data.meta.result_count > 0) {
                responsesTweets.push(res.data.data)

                if (res.data.meta.next_token) {
                    tweets_next_PageToken = res.data.meta.next_token
                } else {
                    tweets_hasNextPage = false
                }
            }
        }).catch((err) => {
            if (err.response) {
                tweets_hasNextPage = false
            }
        })
    }

    // Current Array: [ [ {tweet1}, {tweet2} ], [ {tweet1}, {tweet2} ], ... ]
    const formatedTweets = formatTweetsArray(responsesTweets)

    return formatedTweets // Example: [ {tweet_id, retweet_count, reply_count, like_count, quote_count}, ...]
}

/*
    This function will return an array with all the likes from a specific tweet
*/
const getTweetLikes = async (tweetId) => {
    let responsesLikes = []

    let likes_hasNextPage = false
    let likes_next_pageToken = ""
    let requestsExceeded = false

    await axios.get(`https://api.twitter.com/2/tweets/${tweetId}/liking_users`, {
        headers: {
            Authorization: `Bearer ${twitterToken}`
        },
        params: {
            max_results: 100
        }
    }).then((res) => {
        if (res.data.meta.result_count > 0) {
            responsesLikes.push(res.data.data)

            if (res.data.meta.next_token) {
                likes_hasNextPage = true
                likes_next_pageToken = res.data.meta.next_token
            }
        }
    }).catch((err) => {
        if (err.response) {
            requestsExceeded = true
            likes_hasNextPage = false
            console.log("Requests exceeded on tweet " + tweetId)
        }
    })

    while (likes_hasNextPage) {
        await axios.get(`https://api.twitter.com/2/tweets/${tweetId}/liking_users`, {
            headers: {
                Authorization: `Bearer ${twitterToken}`
            },
            params: {
                max_results: 100,
                pagination_token: likes_next_pageToken
            }
        }).then((res) => {
            if (res.data.meta.result_count > 0) {
                responsesLikes.push(res.data.data)

                if (res.data.meta.next_token) {
                    likes_next_pageToken = res.data.meta.next_token
                } else {
                    likes_hasNextPage = false
                }
            } else {
                likes_hasNextPage = false
            }
        }).catch((err) => {
            if (err.response) {
                requestsExceeded = true
                likes_hasNextPage = false
                console.log("Requests exceeded on tweet " + tweetId)
            }
        })
    }

    // Current array: [ [ {user1}, {user2} ], [ {user3}, {user4} ], ... ]
    const formattedLikes = formatLikesArray(responsesLikes)

    if (requestsExceeded) {
        const newObject = { "tweet_id": tweetId, "likes": formattedLikes, "token": likes_next_pageToken }
        return newObject // Example: {id: "2003", likes: ["123", "456", "789"], token: "sdf1" }
    }

    const newObject = { "tweet_id": tweetId, "likes": formattedLikes, "token": "" }

    return newObject // Example: {id: "2003", likes: ["123", "456", "789"], token: "sdf1" }
}

/*
    This function will add all the tweets into the DB (from scratch) and also updates existing ones
*/
const addTweets = async () => {
    const tweets = await getTweets(config.TWITTER_PAGE_ID)

    for (const tweet of tweets) {
        db.query("INSERT INTO tweets (??) VALUES (?) ON DUPLICATE KEY UPDATE tweet_id=VALUES(tweet_id), retweet_count=VALUES(retweet_count), reply_count=VALUES(reply_count), like_count=VALUES(like_count), quote_count=VALUES(quote_count)", [Object.keys(tweet), Object.values(tweet)], (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
}

/*
    This function will add all the likes into the DB (from scratch)
*/

const addLikes = async () => {

    // Only retrieve the tweets that have likes
    let tweets = await executeQueries("SELECT * FROM tweets WHERE like_count > 0")

    for (const tweet of tweets) {
        console.log(`Tweet: ${tweet.tweet_id}; Likes: ${tweet.like_count}`)
        const request = await getTweetLikes(tweet.tweet_id)

        if (request.token === "") {
            for (const userId of request.likes) {
                db.query("INSERT INTO liked_tweets (user_id, tweet_id) VALUES (?, ?)", [userId, tweet.tweet_id], (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
        } else if (request.token.length > 0) {
            // It means this tweet wasn't checked because there was an error, insert the likes and the token
            for (const userId of request.likes) {
                db.query("INSERT INTO liked_tweets (user_id, tweet_id) VALUES (?, ?)", [userId, tweet.tweet_id], (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }

            db.query("INSERT INTO tokens (operation, token, tweet_id) VALUES (?, ?, ?)", ["like", request.token, tweet.tweet_id], (err) => {
                if (err) {
                    console.log(err)
                }
                console.log("Token Added")
            })
            break
        }
    }
    console.log("Likes have been added")
}

/*
    This function will get the rest of the likes and store them in the DB, if there's no token, it means all likes are already in the DB
*/

const updateLikes = async () => {
    const tweets = await executeQueries("SELECT * FROM tweets WHERE like_count > 0")
    const likesDB = await executeQueries("SELECT * FROM liked_tweets")


    for (const tweet of tweets) {
        const tweetLikes = await getTweetLikes(tweet.tweet_id)
        for (const like of tweetLikes.likes) {
            const userLiked = await executeQueries(`SELECT * FROM liked_tweets WHERE tweet_id = ${tweet.tweet_id} AND user_id = ${like}`)

            if (!userLiked.length > 0) {
                db.query("INSERT INTO liked_tweets (user_id, tweet_id) VALUES (?, ?)", [like, tweet.tweet_id], (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
                break
            }
        }

    }
}

const updateLikes_1 = async () => {
    const lastChecked = await executeQueries("SELECT * FROM tokens WHERE operation = 'like'")
    const tweets = await executeQueries("SELECT * FROM tweets WHERE like_count > 0")

    if (lastChecked.length > 0) {
        const start = lastChecked[0].tweet_id
        const token = lastChecked[0].token

        let update = false

        for (const tweet of tweets) {
            if (tweet.tweet_id === start) {
                update = true
            }

            if (update) {
                const likes = await getTweetLikes(tweet.tweet_id)

                likes.likes.forEach((userId) => {
                    db.query("INSERT INTO liked_tweets (user_id, tweet_id) VALUES (?, ?)", [userId, tweet.tweet_id], (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                })

                if (likes.token !== "") {
                    update = false
                    db.query(`UPDATE tokens SET token = ${likes.token}, tweet_id = ${likes.tweet_id} WHERE operation = 'like'`, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    break
                }
            }
        }
    } else {
        console.log("There's no token stored in the DB. Don't know from where to start")
    }
}

/*
    This function will update all the tweets in the DB
*/

const updateTweets = async (pageId) => {
    const tweetsDB = await executeQueries("SELECT * FROM tweets")
    const currentTweets = await getTweets(pageId)

    for (let i = 0; i < currentTweets.length; i++) {
        for (let j = 0; j < tweetsDB.length; j++) {
            if (currentTweets[i].tweet_id === tweetsDB[j].tweet_id) {
                if (currentTweets[i].like_count !== tweetsDB[j].like_count) {
                    db.query(`UPDATE tweets SET like_count = ${currentTweets[i].like_count} WHERE tweet_id = ${currentTweets[i].tweet_id}`)
                }
                break
            }
        }
    }
    console.log("Tweets updated")
}

async function executeQueries(query, r) {
    return new Promise(function (resolve, reject) {
        let exec = db.query(query, r || null, function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                console.log(exec.sql);
                resolve({ status: "error", message: "Error Getting Data", debug: err });
            }
        });
    });
};

module.exports = {
    executeQueries: executeQueries,
    getUser: getUser,
    userLikes: userLikes,
    addTweets: addTweets,
    addLikes: addLikes,
    updateTweets: updateTweets,
    updateLikes: updateLikes
}
