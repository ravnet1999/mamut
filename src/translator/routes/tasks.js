const express = require('express');
const router = express.Router();
const query = require('../src/mysql/query');
const response = require('../src/response');
const helpers = require('../src/tasks/helpers');

const stampTask = (stampName, taskId, operatorId, description, callback) => {
    query('INSERT INTO `zgloszenia_stemple` ( `godzina` , `nazwa` , `id_zgloszenia` , `id_informatyka`, `opis` ) VALUES (NOW(), ?, ?, ?, ?)', [stampName, taskId, operatorId, description], callback);
}

router.get('/:offset/:limit/:status?', (req, res, next) => {
    query('SELECT * FROM `zgloszenia_glowne` WHERE `informatyk`=?' + (req.params.status ? ' AND `status`=?' : '') + ' ORDER BY `id` DESC LIMIT ? OFFSET ?', [req.body.operatorId, req.params.status, Number(req.params.limit), Number(req.params.offset)], (tasks, fields) => {
        response(res, false, ['Pomyślnie pobrano zadania dla operatora.'], tasks);
        return;
    });
});

router.put('/:issuerId/:concernedId/:serviceId/:categoryId/:departmentId/:channelId/:type/:emailNotif/:priorityId', (req, res, next) => {
    query('SELECT * FROM `uzytkownicy` as `issuers` WHERE `id`=?', [req.params.issuerId], (issuers, fields) => {
        let issuer = issuers[0];
        query('SELECT * FROM `uzytkownicy` WHERE `id`=?', [req.params.concernedId], (concernedUsers, fields) => {
            let concernedUser = concernedUsers[0];
            if(!concernedUser) {
                concernedUser = issuer;
            }
            query('SELECT * FROM `lokalizacje` WHERE `id`=?', [issuer.lokalizacja], (localizedIn, fields) => {
                let issuerLocalizedIn = localizedIn[0];
                query('SELECT * FROM `lokalizacje` WHERE `id`=?', [concernedUser.lokalizacja], (concernedLocalizedIn, fields) => {
                    let concernedUserLocalizedIn = concernedLocalizedIn[0];
                    query('SELECT * FROM `sl_kanaly` WHERE `id`=?', [req.params.channelId], (channels, fields) => {
                        let channel = channels[0];
                        query('SELECT * FROM `sl_klientow` WHERE `id`=?', [issuer.id_klienta], (companies, fields) => {
                            let issuerCompany = companies[0];
                            query('SELECT * FROM `sl_klientow` WHERE `id`=?', [concernedUser.id_klienta], (concernedCompanies, fields) => {
                                let concernedCompany = concernedCompanies[0];
                                query('SELECT * FROM `sl_uslugi` WHERE `id`=?', [req.params.serviceId], (services, fields) => {
                                    let service = services[0];
                                    query('SELECT * FROM `sl_kat_zapytanie` WHERE `id`=?', [req.params.categoryId], (categories, fields) => {
                                        let category = categories[0];
                                        query('SELECT * FROM `sl_komorek` WHERE `id`=?', [req.params.departmentId], (departments, fields) => {
                                            let department = departments[0];
                                            query('SELECT * FROM `sl_priorytety` WHERE `id`=?', [req.params.priorityId], (priorities, fields) => {
                                                let priority = priorities[0];

                                                let type = req.params.type == 0 ? 'problem' : 'zadanie';
                                                let emailNotif = req.params.emailNotif == 0 ? '-' : 'on'; 

                                                console.log(channel, category, department, priority)
        
                                                let taskQuery = helpers.buildTaskQuery(issuer, issuerCompany, '', issuerLocalizedIn, channel.id, type, '', '', concernedUser, concernedCompany, '', concernedUserLocalizedIn, '', '', service.id, service.nazwa, category.id, '', Date.now(), department.id, req.body.operatorId, 'on', priority.id, '-', '');

                                                query(taskQuery.query, taskQuery.values, (taskInsertResult, fields) => {
                                                    console.log(taskInsertResult);
                                                    query('INSERT INTO zgloszenia_stemple ( godzina , nazwa , id_zgloszenia , id_informatyka ) VALUES (NOW(), ?, ?, ?)', ['nowy etap', taskInsertResult.insertId, req.body.operatorId], (stampInsertResult, fields) => {
                                                        query('UPDATE zgloszenia_glowne SET komorka=?, informatyk=? WHERE id=?', [department.id, req.body.operatorId, taskInsertResult.insertId], (taskUpdateResult, fields) => {
                                                            query('INSERT INTO zgloszenia_etapy ( id_zgloszenia , id_informatyka , id_komorki) VALUES ( ?, ?, ? )', [taskInsertResult.insertId, req.body.operatorId, department.id], (episodeInsertResult, fields) => {
                                                                response(res, false, ['Pomyślnie dodano zadanie.'], [episodeInsertResult]);
                                                                return;
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.post('/:taskId/start', (req, res, next) => {
    stampTask('START', req.params.taskId, req.body.operatorId, '', (result) => {
        response(res, false, ['Poprawnie rozpoczęto zadanie.'], [result]);
        return;
    })    
});

router.post('/:taskId/stop', (req, res, next) => {
    stampTask('OCZEKUJE', req.params.taskId, req.body.operatorId, 'Pauza w aplikacji mobilnej', (result) => {
        response(res, false, ['Poprawnie wstrzymano zadanie.'], [result]);
        return;
    })    
});

router.post('/:taskId/reassign/:departmentId/:newOperatorId', (req, res, next) => {
    stampTask('Zmiana przypisania', req.params.taskId, req.body.operatorId, '', (result) => {
        query('UPDATE `zgloszenia_glowne` SET `komorka`=?, `informatyk`=? WHERE `id`=?', [req.params.departmentId, req.params.newOperatorId, req.params.taskId], (result) => {
            query('INSERT INTO `zgloszenia_etapy` ( `id_zgloszenia` , `id_informatyka` , `id_komorki`) VALUES (?, ?, ?)', [req.params.taskId, req.params.newOperatorId, req.params.departmentId], (result) => {

            });
        });
    })    
});
module.exports = router;