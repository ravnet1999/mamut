const express = require('express');
const router = express.Router();
const companyService = require('../src/services/Company/CompanyService');
const companyLocationService = require('../src/services/Company/CompanyLocationService');
const response = require('../src/response');
const charset = require('../src/helpers/charset');

router.get('/', (req, res, next) => {
    companyService.find(9999999, 0, 'id', 'ASC', '`aktywny` = \'on\'').then((companies) => {
        companies = companies.map((company) => {
            return charset.translateIn(company);
        });
        response(res, false, ['Pomyślnie pobrano firmy.'], companies);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania firmy.`, JSON.stringify(err)], []);
        return;
    });
});

router.get('/:companyIds', (req, res, next) => {
    let companyIds = req.params.companyIds.split(',');
    companyService.findById(companyIds).then((companies) => {
        companies = companies.map((company) => {
            return charset.translateIn(company);
        });
        response(res, false, ['Pomyślnie pobrano firmę.'], companies);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania firmy.`, JSON.stringify(err)], [])
    });
});

router.get('/:companyId/location', (req, res, next) => {
    companyLocationService.findByCompanyId(req.params.companyId).then((companyLocations) => {
        response(res, false, ['Pomyślnie pobrano lokalizację firmy.'], [companyLocations[0]]);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania lokalizacji firmy.`, JSON.stringify(err)], [])
    });
});

router.get('/:companyId/locations', (req, res, next) => {
      companyLocationService.findByCompanyId(req.params.companyId).then((companyLocations) => {
    
      companyLocations.map((companyLocation) => {
        return charset.translateIn(companyLocation);
      });

      response(res, false, ['Pomyślnie pobrano lokalizacje firmy.'], companyLocations);
      return;
  }).catch((err) => {
      response(res, true, [`Wystąpił błąd podczas próby pobrania lokalizacji firmy.`, JSON.stringify(err)], [])
  });
});

router.patch('/:companyId/documentation', (req, res, next) => {

  let documentation = req.body.documentation;

  companyService.updateById(req.params.companyId, ['dokumentacja'], [documentation]).then((result) => {
      response(res, false, ['Pomyślnie zmodyfikowano dokumentację firmy.'], [result]);
      return;
  }).catch((err) => {
      response(res, true, ['Wystąpił błąd podczas próby modyfikacji dokumentacji firmy', JSON.stringify(err)], []);
      return;
  });
});

module.exports = router;