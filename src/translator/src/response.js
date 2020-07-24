const buildResponse = (res, errorStatus = true, messages = ['Coś poszło nie tak.'], resources = []) => {
    res.json({
        error: errorStatus,
        messages: messages,
        resources: resources
    });
};


module.exports = buildResponse;