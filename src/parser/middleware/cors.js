const cors = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8501');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    next();
}

module.exports = cors;