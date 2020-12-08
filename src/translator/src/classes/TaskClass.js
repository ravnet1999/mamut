const taskService = require('../services/Task/TaskService');
const taskEpisodeService = require('../services/Task/TaskEpisodeService');
const changeHistoryService = require('../services/ChangeHistoryService');
const taskInvoiceService = require('../services/Task/TaskInvoiceService');
const taskStampService = require('../services/Task/TaskStampService');
const charset = require('../helpers/charset');

class Task {
    constructor(id = null) {
        this.body = {};
        this.stamps = [];
        if(id) {
            this.body.id = id;
        }
    }

    static fetchTasks = (departmentId, operatorId, limit = 25, offset = 0, status) => {
        let operator = '`informatyk` = \'' + operatorId + '\'';
        let taskStatus = status ? ' AND `status`=\'' + status + '\'' : ''; 
        let department = departmentId ? ' AND `komorka`=\'' + departmentId + '\'' : '';
    
        return taskService.find(limit, offset, 'id', 'DESC', operator + taskStatus + department ).then((tasks) => {
            let taskObjects = tasks.map((task) => {
                return new Task().parseTask(task);
            });

            return taskObjects;
        });
    }

    parseTask = (taskObject) => {
        for(let key in taskObject) {
            this.body[key] = taskObject[key];
        }

        return this;
    }

    fetchTask = () => {
        return taskService.findById(this.body.id).then((tasks) => {
            let task = tasks[0];

            for(let key in task) {
                this.body[key] = task[key];
            }

            return this;
        });
    }

    patchTask = (taskObject) => {
        let newTask = {};

        for(let taskKey in this.body) {
            newTask[taskKey] = this.body[taskKey];
        }

        for(let taskObjectKey in taskObject) {
            newTask[taskObjectKey] = taskObject[taskObjectKey];
        }

        let columns = [];
        let values = [];

        for(let newTaskKey in newTask) {
            columns.push(newTaskKey);
            values.push(newTask[newTaskKey]);
        }

        return taskService.updateById(this.body.id, columns, values).then((result) => {
            for(let newTaskKey in newTask) {
                this.body[newTaskKey] = newTask[newTaskKey];
            }

            return this;
        });
    }

    createTask = (taskObject, operatorId) => {
        if(taskObject && taskObject.id) delete taskObject.id;

        let columns = [];
        let values = [];

        for(let taskObjectKey in taskObject) {
            columns.push(taskObjectKey);
            values.push(taskObject[taskObjectKey]);
        }

        console.log(columns, values);

        return taskService.insert(columns, values).then((result) => {
            console.log('inserted');
            this.body.id = result.insertId;

            for(let taskObjectKey in taskObject) {
                this.body[taskObjectKey] = taskObject[taskObjectKey];
            }

            return taskStampService.stamp('dodanie zgł.', this.body.id, operatorId);
        }).then((stampAddTaskResult) => {
            return taskStampService.stamp('nowy etap', this.body.id, operatorId);
        }).then((stampAddEpisodeResult) => {
            return taskService.updateById(this.body.id, ['komorka', 'informatyk'], [this.body.komorka, operatorId]);
        }).then((updateResult) => {
            return this;
        });
    }

    startTask = (operatorId) => {
        return taskStampService.find(1, 0, 'id', 'DESC', "`id_zgloszenia` = '" + this.body.id + "'").then((taskStamp) => {
            if(taskStamp.length > 0 && taskStamp[0].nazwa == 'START') {
                return;
            }
    
            return taskStampService.stamp('START', this.body.id, operatorId, '');
        });
    }

    stopTask = (operatorId) => {
        return taskStampService.find(1, 0, 'id', 'DESC', "`id_zgloszenia` = '" + this.body.id + "'").then((taskStamp) => {
            if(taskStamp[0].nazwa == 'OCZEKUJE') {
                return;
            } else {
                return taskStampService.stamp('OCZEKUJE', this.body.id, operatorId, 'Oczekiwanie na kolejną czynność.');
            }
        });
    }

    reassignTask = (operatorId, targetOperatorId, departmentId) => {
        return taskStampService.stamp('Zmiana przypisania', this.body.id, operatorId, '').then((stampResult) => {
            return taskEpisodeService.addEpisode(this.body.id, targetOperatorId, departmentId);
        }).then((addEpisodeResult) => {
            return taskService.updateById(this.body.id, ['komorka', 'informatyk'], [departmentId, targetOperatorId]);
        }).then((taskUpdateResult) => {
            return taskStampService.stamp('OCZEKUJE', this.body.id, operatorId, 'Przekazane do dalszej realizacji.').then((reassignResult) => {
                return taskUpdateResult;
            });
        });
    }

    closeTask = (operatorId) => {
        return taskStampService.stamp('Zamknij', this.body.id, operatorId).then((stampCloseResult) => {
            return changeHistoryService.insert([`id_sp` , `tabela_sp` , `pole` , `wartosc` , `data` , `user`], [this.body.id, 'zgloszenia_glowne', 'status', 'open', 'NOW()', operatorId]);
        }).then((historyInsertResult) => {
            return taskService.updateById(this.body.id, ['status'], ['close']);
        }).then((taskUpdateResult) => {
            return taskInvoiceService.insert(['id_zgloszenia', 'osoba_odpowiedzialna'], [this.body.id, operatorId]).then((invoiceInsertResult) => {
                return taskUpdateResult;
            });
        });
    }
}

// {
//     "id": 72208,
//     "id_zglaszajacy": 20,
//     "zglaszajacy": "Rafał Radzki",
//     "vip": "on",
//     "login": "rafalr",
//     "komputer": "",
//     "id_komputera": 0,
//     "id_klienta": 10,
//     "klient": "RavNet",
//     "telefon": "8697515",
//     "numer_wewnetrzny": "100",
//     "tel_komorkowy": "502053931",
//     "nr_pokoju": "",
//     "adres_email": "rafal.radzki@ravnet.pl",
//     "id_lokalizacja": 12,
//     "lokalizacja": "RAVNET Sp. z o.o.",
//     "problem": 0,
//     "id_zglaszajacy_dot": "20",
//     "zglaszajacy_dot": "Rafał Radzki",
//     "vip_dot": "on",
//     "login_dot": "rafalr",
//     "komputer_dot": "",
//     "id_komputera_dot": 0,
//     "id_klienta_dot": 10,
//     "klient_dot": "RavNet",
//     "telefon_dot": "8697515",
//     "numer_wewnetrzny_dot": "100",
//     "tel_komorkowy_dot": "502053931",
//     "nr_pokoju_dot": "",
//     "adres_email_dot": "rafal.radzki@ravnet.pl",
//     "id_lokalizacja_dot": 12,
//     "lokalizacja_dot": "RAVNET Sp. z o.o.",
//     "id_serwera": 0,
//     "serwer": "0",
//     "siec": 0,
//     "id_uslugi": 91,
//     "usluga": "Błąd typu C - pozostałe",
//     "kat_zapytanie": 1,
//     "id_kategorii": 0,
//     "kategoria": "0",
//     "opis": "Test przed wdrożeniem",
//     "wplyw": "0",
//     "pilne": "0",
//     "uwagi": "",
//     "terminowe": "",
//     "termin": "0000-00-00 00:00:00",
//     "komorka": 2,
//     "informatyk": 30,
//     "status": "close",
//     "kat_zamkniecia": 0,
//     "oczekiwanie": "",
//     "serwis": "",
//     "kanal": 3,
//     "priorytet": 2,
//     "cyklicznosc": "",
//     "cykl_cron": "",
//     "problem_zadanie": "zadanie",
//     "rozliczone": "",
//     "powiadomienie_email": "on"
// }

module.exports = Task;