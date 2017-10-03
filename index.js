const express = require('express');
const graphQLHTTP = require('express-graphql');
const DataLoader = require('dataloader');
const axios = require('axios');

const { schema } = require('./schemas');

const BASE_URL = 'http://localhost:3000';

const fetchSportById = sportId => {
  return axios.get(`${BASE_URL}/sports/${sportId}`)
              .then(res => { return res.data; });
};

const app = express();

app.use(graphQLHTTP(res => {
  const sportLoader = new DataLoader(
    keys => Promise.all(keys.map(fetchSportById))
  );

  const loaders = {
    sport: sportLoader,
  };

  return {
    context: { loaders },
    schema,
    graphiql: true,
  };
}))

app.listen(5000);
