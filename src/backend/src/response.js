const response = (res, errorStatus = true, messages = [], resources = [], redirectTo = '') => {
    res.json({
        error: errorStatus,
        messages: messages,
        resources: resources,
        redirect: redirectTo
    });
}

module.exports = response;