const { GraphQLSchema } = require('graphql');
const { QueryType } = require('./../types');

exports.schema = new GraphQLSchema({
  query: QueryType,
});
