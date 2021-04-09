const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// GraphQL Schema
const schema = buildSchema(`
  type Query {
    courseId(id: Int!): Course
    courses(topic: String): [Course]
  }

  type Mutation {
    updateCourse(id: Int!, topic: String!): Course
  }

  type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
  }
`);

const coursesData = [
  {
    id:1,
    title: "The Complete Node.js",
    author: "Andrew",
    description: "Aprenda Node",
    topic: "Node.js",
    url: "http://www.teste.com.br"
  },
  {
    id:2,
    title: "The Complete Node.js 2",
    author: "Antonio 2",
    description: "Aprenda Node 2",
    topic: "Node.js 2",
    url: "http://www.teste2.com.br"
  },
  {
    id:3,
    title: "The Javascript",
    author: "Vergara 3",
    description: "Aprenda JS 3",
    topic: "Javascript 3",
    url: "http://www.teste3.com.br"
  }
]

const getCourse = (args) => {
  const id = args.id;
  return coursesData.filter(course => {
    return course.id == id
  })[0];
}

const getCourses = (args) => {
  if(args.topic){
    const topic = args.topic;
    return coursesData.filter(course => course.topic === topic);
  } else {
    return coursesData;
  }
}

const updateCourse = ({id,topic}) => {
  coursesData.map(course => {
    if(course.id === id){
      course.topic = topic;
      return course;
    }
  });
  return coursesData.filter(course => course.id === id)[0];
}

//Root Resolver
const root = {
  courseId: getCourse,
  courses: getCourses,
  updateCourse: updateCourse
}

//Create an express server and GraphQL endpoint
const app =  express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(4000, () => console.log("servidor iniciado. localhost:4000/graphql"))