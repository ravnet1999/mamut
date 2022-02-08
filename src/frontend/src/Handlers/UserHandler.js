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
    validate: (data) => {
      let messages = [];

      const requiredFields = [
        {'name': 'firstname', 'label': 'imię'}, 
        {'name': 'name', 'label': 'nazwisko'}, 
        {'name': 'email', 'label': 'email'},
        {'name': 'phone', 'label':'telefon'}, 
        {'name': 'client', 'label': 'nazwa firmy'}, 
        {'name': 'location', 'label': 'lokalizacja'}
      ];

      let emptyFields = requiredFields.filter(field => {
        return !data[field.name] || data[field.name].trim().length === 0;
      });

      let emptyFieldsLabels = emptyFields.map(field => field.label);

      if(emptyFields.length > 0) {        
        let emptyFieldsLabelsString = emptyFieldsLabels.join(', ');
        messages.push(`Uzupełnij wymagane pola: ${emptyFieldsLabelsString}.`);
      }

      if(!emptyFieldsLabels.includes('email')) {
        let emailValid = /.+@.+\.[A-Za-z]+$/.test(data['email']);

        if(!emailValid) {
          messages.push(`Niewłaściwy format adresu email.`);
        }
      }

      return messages;
    },
    create: (data) => {
      let messages = UserHandler.validate(data);

      return new Promise((resolve, reject) => {
        if(messages.length > 0) {
          reject({
            error: true,
            messages: messages,
            resources: []
          });
          return;
        }
        
        resolve({
          error: false,
          messages: ['Reprezentant został dodany'],
          resources: [],
          // redirect: '/clients'
        });
    });
  }
}

export default UserHandler;