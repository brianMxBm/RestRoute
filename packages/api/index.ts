import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// export const ExpoSecureStoreAdapter = {
//   //@TODO: This is probably an anti-pattern
//   getItem: (key: string) => SecureStore.getItemAsync(key),
//   setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
//   removeItem: (key: string) => SecureStore.deleteItemAsync(key),
// };

export const api = axios.create({
  baseURL: 'http://localhost:8080', //@TODO: This has to be dynamic
  timeout: 3000,
});

// api.interceptors.request.use(
//   async function (config) {
//     const accessToken = await ExpoSecureStoreAdapter.getItem('sessionKey');

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },

//   function (error) {
//     return Promise.reject(error);
//   }
// );
