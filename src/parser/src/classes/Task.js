const taskDefaults = require('../../config/appConfig.json');
const taskService = require('../services/TaskServices/TaskService');
const serviceService = require('../services/TaskServices/ServiceService');
const companyService = require('../services/CompanyService');

class Task {
    constructor(clientId = null, repId = null) {
        this.clientId = clientId;
        this.repId = repId;
        this.body = {}
        this.buildDefaults();
    }

    copyToConcernedIssuer = () => {
        for(let key in this.body) {
            if(key.includes('_dot')) {
                this.body[key] = this.body[key.replace(/_dot/gi, '')];
            }
        }
    }

    fetchTask = (taskId, operatorId) => {
        return taskService.getTaskById(taskId, operatorId).then((task) => {
            for(let taskKey in task[0]) {
                this.body[taskKey] = task[0][taskKey];
            }

            return this;
        });
    }

    buildTask = (clientId, repId, operatorId) => {
        return companyService.getRepresentative(repId).then((rep) => {
            this.body.id_zglaszajacy = rep.id;
            this.body.zglaszajacy = rep.imie + ' ' + rep.nazwisko;
            this.body.vip = rep.vip;
            this.body.login = rep.login;
            this.body.komputer = 0;
            this.body.id_komputera = 0;
            this.body.tel_komorkowy = rep.tel_komorkowy;
            this.body.adres_email = rep.adres_email;

            return companyService.getCompany(clientId);
        }).then((companies) => {
            let company = companies[0];
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

            this.copyToConcernedIssuer();

            return this;
        });
    }

    createTask = (operatorId, taskObject) => {
        return this.buildTask(this.clientId, this.repId, operatorId).then((task) => {
            for(let key in taskObject) {
                this.body[key] = taskObject[key];
            }
            return taskService.createTask({ task: this.body, operatorId: operatorId });
        }).then((result) => {
            let task = new Task().parseTask(result.resources[0]);
            return task;
        });
    }

    // patchTask = (taskId, taskObject, operatorId) => {
    //     return this.fetchTask(taskId, operatorId).then((task) => {
    //         for(let key in taskObject) {
    //             this.body[key] = taskObject[key];
    //         }

    //         if(this.body && this.body.lastStamp) delete this.body.lastStamp;

    //         this.copyToConcernedIssuer();

    //         return taskService.patchTask(this.body.id, this.body);  
    //     })
    // }

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