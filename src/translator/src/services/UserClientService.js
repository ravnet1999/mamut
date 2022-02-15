const connection = require('../mysql/connection');
const charset = require('../helpers/charset');

class UserClientService {
    constructor(usersTableName, clientsTableName) {
        this.usersTableName = usersTableName;
        this.clientsTableName = clientsTableName;

        this.findByIdEmpty = 'Taki użytkownik nie istnieje!';
    }

    findByUserId = (userId) => {      
      return new Promise((resolve, reject) => {
        let params = [];

        let query =`
          SELECT
            uzytkownicy.id,
            tel_komorkowy,
            numer_wewnetrzny,
            imie,
            nazwisko,
            id_klienta,
            sl_klientow.nazwa
          FROM
            uzytkownicy
          JOIN sl_klientow ON
            uzytkownicy.id_klienta = sl_klientow.id
          WHERE
            uzytkownicy.aktywny = 'on' 
            AND sl_klientow.aktywny = 'on'
            AND uzytkownicy.id = ?`;
        
        params.push(userId);  

        connection.query(query, params, (err, results, fields) => {
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
      });
    }

    search = (text) => {
      return new Promise((resolve, reject) => {
        let phoneNumber = text.replace(/\D/g,'');
        
        let name = text.replace(/[^AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻżXxVvQq]/g,'');
        let nameObj = charset.translateOut({name});
        name = nameObj.name;

        let phoneNumberCharsLimit = 3;
        let nameCharsLimit = 3;

        if(phoneNumber.length >= phoneNumberCharsLimit || name.length >= nameCharsLimit) {        
          let params = [];

          let query =`
            SELECT
              uzytkownicy.id,
              tel_komorkowy,
              numer_wewnetrzny,
              imie,
              nazwisko,
              id_klienta,
              sl_klientow.nazwa
            FROM
              uzytkownicy
            JOIN sl_klientow ON
              uzytkownicy.id_klienta = sl_klientow.id
            WHERE
              uzytkownicy.aktywny = 'on' AND sl_klientow.aktywny = 'on'`;
                
          if(phoneNumber.length >= phoneNumberCharsLimit) {
            query += `
              AND(
                REPLACE(
                  REPLACE(
                    REPLACE(
                      REPLACE(
                        tel_komorkowy,"-", ""
                      )," ",""
                    ),"tel.",""
                  ),"kom.",""
                ) LIKE ? OR
                REPLACE(
                  REPLACE(
                    REPLACE(
                      REPLACE(
                        REPLACE(
                          REPLACE(
                            numer_wewnetrzny, "-", ""
                          )," ",""
                        ),"tel.:",""
                      ),"w.",""
                    ),"(",""
                  ),")",""
                ) LIKE ?
              )`;  

              params.push("%" + phoneNumber + "%");
              params.push("%" + phoneNumber + "%");  
          }
          
          if(name.length >= nameCharsLimit) {
            query += `              
              AND(
                CONCAT(
                  uzytkownicy.imie,
                  uzytkownicy.nazwisko
                ) LIKE ? OR 
                CONCAT(
                  uzytkownicy.nazwisko,
                  uzytkownicy.imie
                ) LIKE ?
              )`;

            params.push("%" + name + "%");
            params.push("%" + name + "%");  
          }

          connection.query(query, params, (err, results, fields) => {
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