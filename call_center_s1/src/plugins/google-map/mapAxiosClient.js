import axios from 'axios'

const mapClient=axios.create({
    baseURL:'https://maps.googleapis.com/maps/api',
    
})
const API_KEY=()=> {return 'AIzaSyDbClsQyJVztvdkXbZgDJBlQFY30BT7zZ8'}
const MAP_API_KEY=()=> {return 'gOaJEchgjoBByaWaik61iQ4uZsRZYC5BqrzOlzNn'}
// Add a request interceptor
mapClient.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
mapClient.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
export  {mapClient,API_KEY,MAP_API_KEY}