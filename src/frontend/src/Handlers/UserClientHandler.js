import axios from 'axios';
import parseResponse from './ApiParser';
import appConfig from '../Config/appConfig.json';

const UserClientHandler = {
    findByPhoneNumber: (phoneNumber) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.users_clients}/${phoneNumber}`, {
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

export default UserClientHandler;