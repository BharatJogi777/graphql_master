import { execute, reset } from "./app.js";

if (process.argv[1]?.endsWith("/lab.ts")) {
  reset();
  const query = await execute("{ products { id sku name priceMinor } }");
  console.log("Initial catalog:", JSON.stringify(query, null, 2));

  const mutation = await execute(
    'mutation { renameProduct(id: "p-1", name: "Ergonomic Keyboard") { id name } }',
  );
  console.log("Mutation:", JSON.stringify(mutation, null, 2));

  const after = await execute('{ product(id: "p-1") { id name } }');
  console.log("After mutation:", JSON.stringify(after, null, 2));
}
