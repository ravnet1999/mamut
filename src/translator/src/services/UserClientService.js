const connection = require('../mysql/connection');

class UserClientService {
    constructor(usersTableName, clientsTableName) {
        this.usersTableName = usersTableName;
        this.clientsTableName = clientsTableName;

        this.findByIdEmpty = 'Taki użytkownik nie istnieje!';
    }

    findByPhoneNumber = (phoneNumber) => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT `uzytkownicy`.`id`, `tel_komorkowy`, `imie`,`nazwisko`, id_klienta, sl_klientow.nazwa FROM `' 
          + this.usersTableName + '` join ' + this.clientsTableName 
          + ' on uzytkownicy.id_klienta=sl_klientow.id'
          + ' WHERE `tel_komorkowy` = ? OR `numer_wewnetrzny` = ?', [phoneNumber, phoneNumber], (err, results, fields) => {
            if(err) {
                reject(err);
                return;
            }

            resolve(results);
            return;
        });
      });    
    }
}

module.exports = new UserClientService('uzytkownicy', 'sl_klientow');