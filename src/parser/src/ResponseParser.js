const parseResponse = (response) => {
    return new Promise((resolve, reject) => {
        if(!Boolean(response.data.error)) {
            resolve(response.data);
            return;
        } else {
            reject(response.data);
            return;
        }
    })
}

module.exports = parseResponse;