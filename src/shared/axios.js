import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://metspark.co.uk/spark/api/0.1', // live production
    timeout: 10000
  });

export default instance;
