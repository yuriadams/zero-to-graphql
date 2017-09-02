const express = require('express');
const graphQLHTTP = require('express-graphql');
const { GraphQLSchema,
        GraphQLObjectType,
        GraphQLString,
        GraphQLList } = require('graphql');

const DataLoader = require('dataloader');
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

const fetchSportById = sportId => {
  return fetch(`${BASE_URL}/sports/${sportId}`)
  .then(res => { return res.json() })
};

const CompetitionType = new GraphQLObjectType({
  name: 'Competition',
  fields: () => ({
    name: { type: GraphQLString, },
    abbreviation: { type: GraphQLString, },
    slug: { type: GraphQLString, },
    externalId: { type: GraphQLString, resolve(root){ return root.external_id; } },
    sport: {
      type: SportType,
      resolve({ sport_id }, args, { loaders }){
        return loaders.sport.load(sport_id);
      }
    }
  })
});

const SportType = new GraphQLObjectType({
  name: 'Sport',
  fields: () => ({
    name: { type: GraphQLString, },
    abbreviation: { type: GraphQLString, },
    competitions: {
      type: new GraphQLList(CompetitionType),
      resolve: ({ competitions }) => {
        return competitions;
      }
    }
  })
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...blabla mestre bimba',
  fields: () => ({
    sport: {
      type: SportType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(root, { id }, { loaders }) {
        return loaders.sport.load(id);
      }
    }
  })
})

const app = express();

const schema = new GraphQLSchema({
  query: QueryType,
});

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
