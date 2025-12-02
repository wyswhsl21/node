const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { buildSchema } = require('graphql');

const app = express();

const root = {
  posts: require('./posts/posts.model'),
  comments: require('./comments/comments.model'),
};

const loadedFiles = loadFilesSync('**/*', {
  extensions: ['graphql'],
});

const schema = makeExecutableSchema({
  typeDefs: loadedFiles,
});

app.use(
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/graphql`);
});
