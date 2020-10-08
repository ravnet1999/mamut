let automationEnabled = false;

const getStatus = () => {
    return automationEnabled;
}

const toggleStatus = () => {
    automationEnabled = !automationEnabled;
    return;
}

module.exports = { toggleStatus: toggleStatus, getStatus: getStatus };