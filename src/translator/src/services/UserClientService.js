const connection = require('../mysql/connection');
const charset = require('../helpers/charset');

class UserClientService {
    constructor(usersTableName, clientsTableName) {
        this.usersTableName = usersTableName;
        this.clientsTableName = clientsTableName;

        this.findByIdEmpty = 'Taki użytkownik nie istnieje!';
    }

    search = (text) => {
      return new Promise((resolve, reject) => {
        let phoneNumber = text .replace(/\D/g,'');

        if(phoneNumber.length>2) {
          connection.query('SELECT `uzytkownicy`.`id`, `tel_komorkowy`, `numer_wewnetrzny`, `imie`,`nazwisko`, id_klienta, sl_klientow.nazwa FROM `' 
            + this.usersTableName + '` join ' + this.clientsTableName 
            + ' on uzytkownicy.id_klienta=sl_klientow.id'
            + ' WHERE (REPLACE(REPLACE(REPLACE(REPLACE(`tel_komorkowy`,"-","")," ", ""),  "tel.", ""), "kom.", "") LIKE ?'
            + ' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`numer_wewnetrzny`,"-","")," ", ""), "tel.:", ""), "w.", ""), "(", ""), ")", "") LIKE ?)'
            + ' AND `' + this.usersTableName + '`.`aktywny`=\'on\''
            + ' AND `' + this.clientsTableName + '`.`aktywny`=\'on\'',
            ["%" + phoneNumber + "%", "%" + phoneNumber + "%"], (err, results, fields) => {
              if(err) {
                  reject(err);
                  return;
              }

              results.map((result) => {
                return charset.translateIn(result);
              });

              resolve(results);
              return;
          });
        } else {
          resolve([]);
        }
      });    
    }
}

module.exports = new UserClientService('uzytkownicy', 'sl_klientow');