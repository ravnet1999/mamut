const Helpers = {
    buildTaskQuery: (issuer, issuerCompany, pcId, localizedIn, channelId, type, roomNumber, pc, concernedUser, concernedCompany, concernedPcId, concernedLocalizedIn, concernedPc, concernedRoomNumber, serviceId, service, category, description, date, departmentId, operatorId, emailNotif, priority, isTerminowe, notes) => {
        let fields = {
            id_zglaszajacy: issuer.id,
            id_klienta: issuer.id_klienta,
            id_komputera: pcId,
            id_lokalizacja: localizedIn.id,
            kanal: channelId,
            telefon: localizedIn.nr_telefonu1,
            problem_zadanie: type,
            vip: issuer.vip,
            zglaszajacy: issuer.imie + ' ' + issuer.nazwisko,
            numer_wewnetrzny: issuer.numer_wewnetrzny,
            nr_pokoju: roomNumber,
            komputer: pc,
            klient: issuerCompany.nazwa,
            lokalizacja: localizedIn.nazwa,
            login: issuer.login,
            adres_email: issuer.adres_email,
            tel_komorkowy: issuer.tel_komorkowy,
            id_zglaszajacy_dot: concernedUser.id,
            id_komputera_dot: concernedPcId,
            id_klienta_dot: concernedUser.id_klienta,
            id_lokalizacja_dot: concernedLocalizedIn.id,
            zglaszajacy_dot: concernedUser.imie + ' ' + concernedUser.nazwisko,
            telefon_dot: concernedLocalizedIn.nr_telefonu1,
            komputer_dot: concernedPc,
            klient_dot: concernedCompany.nazwa,
            numer_wewnetrzny_dot: concernedUser.numer_wewnetrzny,
            nr_pokoju_dot: concernedRoomNumber,
            lokalizacja_dot: concernedLocalizedIn.nazwa,
            adres_email_dot: concernedUser.adres_email,
            tel_komorkowy_dot: concernedUser.tel_komorkowy,
            login_dot: concernedUser.login,
            id_uslugi: serviceId,
            usluga: service,
            kat_zapytanie: category,
            opis: description,
            termin: date,
            komorka: departmentId,
            informatyk: operatorId,
            powiadomienie_email: emailNotif,
            priorytet: priority,
            vip_dot: concernedUser.vip,
            terminowe: isTerminowe,
            uwagi: notes
        }

        for(field in fields) {
            console.log(field, ': ', fields[field]);
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