import axios from 'axios';
import parseResponse from '../Handlers/ApiParser';
import appConfig from '../Config/appConfig.json';

const getUnsortedRepresentatives = (clientId) => {
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
};

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
    getRepresentatives: getUnsortedRepresentatives,

    getSortedRepresentatives: async (clientId) => {
      const response = await getUnsortedRepresentatives(clientId);
      const unsortedRepresentatives = response.resources;
      const sortedRepresentatives = unsortedRepresentatives.sort((a, b) => {
        return (a.imie + a.nazwisko) > (b.imie + b.nazwisko) ? 1 : ( (a.imie + a.nazwisko) < (b.imie + b.nazwisko) ? -1 : 0 );
      });

      return { resources: sortedRepresentatives };
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
    },

    getLocations: (clientId) => {
      return new Promise((resolve, reject) => {
          axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.clients}/${clientId}/locations`, {
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

export default ClientHandler;