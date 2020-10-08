import axios from 'axios';
import parseResponse from '../Handlers/ApiParser';
import appConfig from '../Config/appConfig.json';

const CompanyEmailsHandler = {
    parseCompanies: () => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.domain}/${appConfig.URLs.fetchEmails}`, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },
}

export default CompanyEmailsHandler;