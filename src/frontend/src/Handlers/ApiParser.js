const parseResponse = (response) => {
    return new Promise((resolve, reject) => {
        if(Boolean(response.data.error)) {
            reject(response.data);
            return;
        } else {
            resolve(response.data);
            return;
        }
    });
}

export default parseResponse;