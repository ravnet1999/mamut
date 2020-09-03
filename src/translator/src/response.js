const buildResponse = (res, errorStatus = true, messages = ['Coś poszło nie tak.'], resources = [], redirect = '') => {
    res.json({
        error: errorStatus,
        messages: messages,
        resources: resources,
        redirect: redirect
    });
};


module.exports = buildResponse;