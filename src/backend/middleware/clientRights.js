const clientService = require('../src/service/ClientService');

const clientRights = (req, res, next) => {
    clientService.getClients(req.operatorId).then((assignments) => {
        req.clientRights = assignments.resources[0].klient;
        next();
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas sprawdzania uprawnień do obsługi klienta.', JSON.stringify(err)], []);
        return;
    });
}

module.exports = clientRights;