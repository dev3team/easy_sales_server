const compareUrl = (fisrtUrl, secondUrl) => {
    return fisrtUrl.split('//')[1] != secondUrl.split('//')[1]
}

module.exports = compareUrl;