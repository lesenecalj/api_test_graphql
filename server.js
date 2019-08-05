const { ApolloServer } = require('apollo-server');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({ 
  typeDefs,
  resolvers
});

server.listen().then(({ url }) =>  {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:$4000${server.subscriptionsPath}`)
});