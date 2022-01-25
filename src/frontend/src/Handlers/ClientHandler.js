import axios from 'axios';
import parseResponse from '../Handlers/ApiParser';
import appConfig from '../Config/appConfig.json';

const ClientHandler = {
    getClients: () => {
        return new Promise((resolve, reject) => {
            console.log(`${appConfig.URLs.domain}/${appConfig.URLs.clients}`);
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.clients}`, {
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
    getRepresentatives: (clientId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.representatives}/findByClientIds/${clientId}`, {
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

    getRepresentative: (repId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.representatives}/${repId}`, {
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

    changeRepresentative: (repId, rep) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${appConfig.URLs.domain}/${appConfig.URLs.representatives}/${repId}`, rep, {
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

export default ClientHandler;