const { GraphQLObjectType,
        GraphQLString,
        GraphQLList } = require('graphql');

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

exports.SportType = SportType;
