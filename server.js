const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// GraphQL Schema
const schema = buildSchema(`
  type Query {
    hello: String
    getIdade(anoNascimento: Int!): Int
    getIdadeCompleto(anoNascimento: Int!): NascimentoCompleto
  }

  type Mutation {
    updateNome(nome: String!): String
  }

  type NascimentoCompleto {
    idade: Int
    maioridade: String
  }
`);

//Root Resolver
let nome = "Desconhecido.";
const rootResolver = {
  hello: () => `Olá, ${nome} `,

  getIdade: (args) => {return 2021 - args.anoNascimento},

  getIdadeCompleto: (args) => {
    let idade = (2021 - args.anoNascimento);
    return {
      idade: idade,
      maioridade: idade > 30 ? "Vixe ... Expirou!" : idade > 18 ? "Você é um Adulto!" : "Ahhh Jovenzinho!"
    }
  },

  updateNome: (args) => {
    nome = args.nome;
    return `O nome:${args.nome} foi definido.`
  }
}

//Create an express server and GraphQL endpoint
const app =  express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootResolver,
  graphiql: true
}));

app.listen(4000, () => console.log("servidor iniciado. localhost:4000/graphql"))