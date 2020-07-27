const Helpers = {
    buildTaskQuery: (requestBody) => {
        let issuer = {
            id_zglaszajacy: requestBody['issuer'].id,
            login: requestBody['issuer'].login,
            id_klienta: requestBody['issuer'].id_klienta,
            zglaszajacy: requestBody['issuer'].imie + ' ' + requestBody['issuer'].nazwisko,
            vip: requestBody['issuer'].vip,
            numer_wewnetrzny: requestBody['issuer'].numer_wewnetrzny,
            adres_email: requestBody['issuer'].adres_email,
            tel_komorkowy: requestBody['issuer'].tel_komorkowy,
            nr_pokoju: requestBody['issuerRoomNumber'],
            id_komputera: requestBody['issuerPcId'],
            komputer: requestBody['issuerPc']
        }

        let issuerCompany = {
            klient: requestBody['issuerCompany'].nazwa,
            lokalizacja: requestBody['issuerCompanyLocation'].nazwa,
            id_lokalizacja: requestBody['issuerCompanyLocation'].id,
            telefon: requestBody['issuerCompanyLocation'].nr_telefonu1
        }

        let concernedUser = {
            id_zglaszajacy_dot: requestBody['concernedUser'].id,
            login_dot: requestBody['concernedUser'].login,
            id_klienta_dot: requestBody['concernedUser'].id_klienta,
            zglaszajacy_dot: requestBody['concernedUser'].imie + ' ' + requestBody['concernedUser'].nazwisko,
            vip_dot: requestBody['concernedUser'].vip,
            numer_wewnetrzny_dot: requestBody['concernedUser'].numer_wewnetrzny,
            adres_email_dot: requestBody['concernedUser'].adres_email,
            tel_komorkowy_dot: requestBody['concernedUser'].tel_komorkowy,
            nr_pokoju_dot: requestBody['concernedRoomNumber'],
            id_komputera_dot: requestBody['concernedPcId'],
            komputer_dot: requestBody['concernedPc']
        }

        let concernedCompany = {
            klient_dot: requestBody['concernedCompany'].nazwa,
            id_lokalizacja_dot: requestBody['concernedCompanyLocation'].id,
            telefon_dot: requestBody['concernedCompanyLocation'].nr_telefonu1,
            lokalizacja_dot: requestBody['concernedCompanyLocation'].nazwa
        }

        let task = {
            kanal: requestBody['channel'],
            problem_zadanie: requestBody['type'],
            id_uslugi: requestBody['serviceId'],
            usluga: requestBody['service'],
            kat_zapytanie: requestBody['category'],
            opis: requestBody['description'],
            komorka: requestBody['department'],
            informatyk: requestBody['operatorId'],
            powiadomienie_email: requestBody['emailNotif'],
            priorytet: requestBody['priority'],
            terminowe: requestBody['isTerminowe'],
            uwagi: requestBody['notes'],
            termin: 'NOW()'
        }

        let fields = {
            ...issuer,
            ...issuerCompany,
            ...concernedUser,
            ...concernedCompany,
            ...task
        }

        for(field in fields) {
            if(!fields[field]) {
                fields[field] = '';
            }
        }

        let query = 'INSERT INTO `zgloszenia_glowne` (';

        let counter = 0;
        for(let field in fields) {
            query += field + (counter < Object.keys(fields).length - 1 ? ',' : '');
            counter++;
        }

        query += ') VALUES (';

        counter = 0;
        for(let field in fields) {
            query += '?' + (counter < Object.keys(fields).length - 1 ? ',' : '');
            counter++;
        }

        query += ')';

        let values = [];
        for(let field in fields) {
            values.push(String(fields[field]));
        }

        return {
            query: query,
            values: values
        };
    }
}

module.exports = Helpers;