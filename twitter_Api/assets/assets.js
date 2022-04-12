const formatLikesArray = (array) => {
    let formated = []

    array.forEach((response) => {
        response.forEach((user) => {
            formated.push(user.id)
        })
    })

    return formated // Example: ["123", "456", "789", ...]
}

const formatTweetsArray = (array) => {
    let formated = []

    array.forEach((response) => {
        response.forEach((tweet) => {
            const newObject = { 
                "tweet_id": tweet.id, 
                "retweet_count": tweet.public_metrics.retweet_count,
                "reply_count": tweet.public_metrics.reply_count,
                "like_count": tweet.public_metrics.like_count,
                "quote_count": tweet.public_metrics.quote_count
            }
            formated.push(newObject)
        })
    })

    return formated // Example: [ {tweet_id, retweet_count, reply_count, like_count, quote_count}, ...]
}

const formatRetweetsArray = (array) => {
    let formatted = []
    array.forEach((response) => {
        response.forEach((user) => formatted.push(user.id))
    })

    return formatted // Example: ["123", "456", "789", ...]
}

module.exports = {
    formatLikesArray: formatLikesArray,
    formatTweetsArray: formatTweetsArray,
    formatRetweetsArray: formatRetweetsArray
}