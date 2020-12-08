const taskDefaults = require('../../config/appConfig.json');
const taskService = require('../service/TaskService');
const serviceService = require('../service/ServiceService');
const companyService = require('../service/CompanyService');

class Task {
    constructor(clientId, repId) {
        this.clientId = clientId;
        this.repId = repId;
        this.body = {}
        this.buildDefaults();
    }

    createTask = (operatorId) => {
        return companyService.getRepresentative(this.repId).then((rep) => {
            this.body.id_zglaszajacy = rep.id;
            this.body.zglaszajacy = rep.imie + ' ' + rep.nazwisko;
            this.body.vip = rep.vip;
            this.body.login = rep.login;
            this.body.komputer = 0;
            this.body.id_komputera = 0;
            this.body.tel_komorkowy = rep.tel_komorkowy;
            this.body.adres_email = rep.adres_email;

            return companyService.getCompany(this.clientId);
        }).then((company) => {
            this.body.id_klienta = company.id;
            this.body.klient = company.nazwa;
            this.body.telefon = company.nr_telefonu1;
            
            return companyService.getCompanyLocation(company.id);
        }).then((companyLocation) => {
            this.body.id_lokalizacja = companyLocation.id;
            this.body.lokalizacja = companyLocation.nazwa;
            
            return serviceService.getService(this.body.id_uslugi);
        }).then((service) => {
            this.body.id_uslugi = service.id;
            this.body.usluga = service.nazwa;
            this.body.informatyk = operatorId;

            for(let key in this.body) {
                if(key.includes('_dot')) {
                    this.body[key] = this.body[key.replace(/_dot/gi, '')];
                }
            }

            return taskService.createTask({ task: this.body, operatorId: operatorId });
        }).then((result) => {
            let task = new Task().parseTask(result.resources[0]);
            return task;
        });

    }

    parseTask = (taskObject) => {
        for(let key in taskObject) {
            this.body[key] = taskObject[key];
        }

        return this;
    }

    buildDefaults = () => {
        for(let key in taskDefaults.tasks) {
            this.body[key] = taskDefaults.tasks[key];
        }
    }
}

module.exports = Task;