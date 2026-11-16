import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Health { status: String!, timestamp: String! }
  type Query { health: Health!, hello: String! }
`);
const queryFields = schema.getQueryType()!.getFields();
queryFields.health.resolve = () => ({ status: "ok", timestamp: new Date().toISOString() });
queryFields.hello.resolve = () => "Hello from a containerized GraphQL API";

export async function createApp() {
  const app = express();
  const server = new ApolloServer({ schema });
  await server.start();
  app.get("/health/live", (_req, res) => res.status(200).json({ status: "alive" }));
  app.get("/health/ready", (_req, res) => res.status(200).json({ status: "ready" }));
  app.use("/graphql", express.json(), expressMiddleware(server, { context: async () => ({}) }));
  return { app, server };
}

if (require.main === module) {
  void (async () => {
    const { app, server } = await createApp();
    const port = Number(process.env.PORT ?? 4000);
    const httpServer = app.listen(port, () => console.log(`Listening on :${port}/graphql`));
    let shuttingDown = false;
    const shutdown = async () => {
      if (shuttingDown) return;
      shuttingDown = true;
      await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => error ? reject(error) : resolve());
      });
      await server.stop();
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  })();
}
