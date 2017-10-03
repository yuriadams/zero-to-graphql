const { GraphQLObjectType,
        GraphQLString,
        GraphQLList } = require('graphql');

const { SportType } = require('./sport')

exports.QueryType = new GraphQLObjectType({
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
});
