const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const clientService = require('../src/service/ClientService');
const companyService = require('../src/service/CompanyService');

/* GET users listing. */
router.get('/', [authMiddleware], (req, res, next) => {
    // clientService.getClients(req.operatorId).then((assignments) => {
        companyService.getCompanies().then((companies) => {
            response(res, false, ['Pomyślnie pobrano klientów.'], companies);
            return;
        }).catch((err) => {
            console.log(err);
            response(res, true, ['Coś poszło nie tak podczas próby pobrania klientów.', JSON.stringify(err)], []);
            return;
        });
        // companyService.getCompaniesWithRepresentatives(assignments.resources[0].klient).then((companiesWithRepresentatives) => {
        //     response(res, false, ['Pomyślnie pobrano klientów.'], companiesWithRepresentatives);
        //     return;
        // }).catch((err) => {
        //     console.log(err);
        //     response(res, true, ['Coś poszło nie tak podczas próby pobrania klientów.', JSON.stringify(err)], []);
        //     return;
        // });
        // companyService.getCompanies(assignments.resources[0].klient).then((companies) => {
        //     console.log(companies);
        //     response(res, false, ['Pomyślnie pobrano klientów.'], companies.resources);
        //     return;
        // }).catch((err) => {
        //     response(res, true, ['Coś poszło nie tak podczas próby pobrania klientów.', JSON.stringify(err)], []);    
        //     return;
        // });
    // }).catch((err) => {
    //     response(res, true, ['Coś poszło nie tak podczas próby pobrania klientów.', JSON.stringify(err)], []);
    //     return;
    // });
});

/* GET clients listing. */
router.get('/:clientIds', [authMiddleware], (req, res, next) => {  
      companyService.getCompanies(req.params.clientIds).then((companies) => {
          response(res, false, ['Pomyślnie pobrano klientów.'], companies);
          return;
      }).catch((err) => {
          console.log(err);
          response(res, true, ['Coś poszło nie tak podczas próby pobrania klientów.', JSON.stringify(err)], []);
          return;
      });
});

router.get('/:clientId/locations', [authMiddleware], (req, res, next) => {
  companyService.getCompanyLocations(req.params.clientId).then((companyLocations) => {
      response(res, false, ['Pomyślnie pobrano lokalizacje.'], companyLocations);
      return;
  }).catch((err) => {
      response(res, true, ['Coś poszło nie tak podczas próby pobrania lokalizacji.', JSON.stringify(err)], companyLocations);
      return;
  });
});

module.exports = router;
