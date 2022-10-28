const express = require('express');
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema")
const main = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

main().catch(error => console.error(error));

app.get("/", (req, res) => {
  res.send("welcome")
});

// app.use because graphqlHTTP is a middleware
app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(PORT, () => {
  console.log(`App running on port http://localhost:${PORT}`)
})