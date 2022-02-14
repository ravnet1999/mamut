import axios from 'axios';
import parseResponse from './ApiParser';
import appConfig from '../Config/appConfig.json';

const UserHandler = {
    getWithTasks: (repId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.representatives}/getWithTasks/${repId}`, {
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
    get: (repId) => {
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
    validate: (form) => {
      let messages = [];

      const requiredFields = [
        {'name': 'imie', 'label': 'imię'}, 
        {'name': 'nazwisko', 'label': 'nazwisko'}, 
        {'name': 'adres_email', 'label': 'email'},
        {'name': 'tel_komorkowy', 'label':'telefon'}, 
        {'name': 'id_klienta', 'label': 'nazwa firmy'}, 
        {'name': 'lokalizacja', 'label': 'lokalizacja'}
      ];

      let emptyFields = requiredFields.filter(field => {
        return !form[field.name] || form[field.name].trim().length === 0;
      });

      let emptyFieldsLabels = emptyFields.map(field => field.label);

      if(emptyFields.length > 0) {        
        let emptyFieldsLabelsString = emptyFieldsLabels.join(', ');
        messages.push(`Uzupełnij wymagane pola: ${emptyFieldsLabelsString}.`);
      }

      if(!emptyFieldsLabels.includes('email')) {
        let emailValid = /.+@.+\.[A-Za-z]+$/.test(form['adres_email']);

        if(!emailValid) {
          messages.push(`Niewłaściwy format adresu email.`);
        }
      }

      return messages;
    },
    create: (form) => {
      let messages = UserHandler.validate(form);

      return new Promise((resolve, reject) => {
        if(messages.length > 0) {
          reject({
            error: true,
            messages: messages,
            resources: []
          });
          return;
        }

        axios.put(`${appConfig.URLs.domain}/${appConfig.URLs.representatives}`, form, {
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
              reject(err);
              return;
          });
    });
  },
  update: (repId, rep) => {
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
  },
}

export default UserHandler;