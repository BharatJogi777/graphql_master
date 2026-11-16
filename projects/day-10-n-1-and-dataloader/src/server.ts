import { startServer } from './schema.js';

startServer()
  .then(({ url }) => console.log(`Day 10 GraphQL lab ready at ${url}`))
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
