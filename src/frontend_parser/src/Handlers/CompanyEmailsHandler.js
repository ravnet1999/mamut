import axios from 'axios';
import parseResponse from '../Handlers/ApiParser';
import appConfig from '../Config/appConfig.json';

const CompanyEmailsHandler = {
    getCompanyEmails: (limit = 0, offset = 0, sortBy = 'companyId', sortWay = 'DESC') => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.companyEmails}/${limit}/${offset}/${sortBy}/${sortWay}`, {
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

    saveCompanyEmails: (companyEmailsArray) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.domain}/${appConfig.URLs.companyEmails}`, {
                companyEmails: companyEmailsArray
            }, {
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
    }
}

export default CompanyEmailsHandler;