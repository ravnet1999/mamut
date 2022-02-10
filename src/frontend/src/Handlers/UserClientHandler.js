import axios from 'axios';
import parseResponse from './ApiParser';
import appConfig from '../Config/appConfig.json';

const UserClientHandler = {
    search: (text) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.representatives_clients}/search/${text}`, {
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
    findByUserId: (userId) => {
      return new Promise((resolve, reject) => {
          axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.representatives_clients}/rep/${userId}`, {
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