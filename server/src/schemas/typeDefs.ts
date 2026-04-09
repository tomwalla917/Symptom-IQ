import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
  }

    type Symptom {
    _id: ID!
    userId: ID!
    name: String!
    severity: Int!
    date: String
    duration: String
    possibleTrigger: String
    notes: String
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getSymptoms: [Symptom]
    getSymptom(id: ID!): Symptom
  }

  type Mutation {
    addSymptom(
      name: String!
      severity: Int!
      date: String
      duration: String
      possibleTrigger: String
      notes: String
    ): Symptom

    updateSymptom(
      id: ID!
      name: String
      severity: Int
      date: String
      duration: String
      possibleTrigger: String
      notes: String
    ): Symptom

    deleteSymptom(id: ID!): Symptom

    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;

export default typeDefs;
