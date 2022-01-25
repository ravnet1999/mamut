const connection = require('../mysql/connection');

class UserClientService {
    constructor(usersTableName, clientsTableName) {
        this.usersTableName = usersTableName;
        this.clientsTableName = clientsTableName;

        this.findByIdEmpty = 'Taki użytkownik nie istnieje!';
    }

    findByPhoneNumber = (phoneNumber) => {
      return new Promise((resolve, reject) => {
        phoneNumber = phoneNumber.replace(/\D/g,'');
        connection.query('SELECT `uzytkownicy`.`id`, `tel_komorkowy`, `numer_wewnetrzny`, `imie`,`nazwisko`, id_klienta, sl_klientow.nazwa FROM `' 
          + this.usersTableName + '` join ' + this.clientsTableName 
          + ' on uzytkownicy.id_klienta=sl_klientow.id'
          + ' WHERE (REPLACE(REPLACE(REPLACE(REPLACE(`tel_komorkowy`,"-","")," ", ""),  "tel.", ""), "kom.", "") LIKE ?'
          + ' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`numer_wewnetrzny`,"-","")," ", ""), "tel.:", ""), "w.", ""), "(", ""), ")", "") LIKE ?)'
          + ' AND `uzytkownicy`.`aktywny`=\'on\'',
          ["%" + phoneNumber + "%", "%" + phoneNumber + "%"], (err, results, fields) => {
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