import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://metspark.co.uk/spark/api/0.1', // live production
    baseURL: 'http://localhost:1337/spark/api/0.1', // local test
    timeout: 10000
  });

export default instance;
