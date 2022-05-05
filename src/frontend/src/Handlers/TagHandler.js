import axios from 'axios';
import parseResponse from './ApiParser';
import appConfig from '../Config/appConfig.json';

const TagHandler = {
  search: (typeId, query) => {
    return new Promise((resolve, reject) => {
        query = encodeURIComponent(query);
        axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.tags}/search/${typeId}/${query}`, {
            withCredentials: true
        }).then((response) => {
            parseResponse(response).then((response) => {
                resolve(response.resources.map(tag => {
                  let option = { 'value': tag.nazwa, 'label': tag.nazwa };
                  return option;
                }));
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
  get: (typeId) => {
    return new Promise((resolve, reject) => {
        axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.tags}/${typeId}`, {
            withCredentials: true
        }).then((response) => {
            parseResponse(response).then((response) => {
                resolve(response.resources.map(tag => {
                  let option = { 'value': tag.nazwa, 'label': tag.nazwa };
                  return option;
                }));
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

export default TagHandler;