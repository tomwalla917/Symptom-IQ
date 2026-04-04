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
    symptomType: String!
    severity: Int!
    duration: String!
    possibleTrigger: String
    notes: String
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getSymptom: [Symptom]
  }

  type Mutation {
    addSymptom(
      symptomType: String!
      severity: Int!
      duration: String!
      possibleTrigger: String
      notes: String
      createdAt: String
    ): Symptom

    deleteSymptom(id: ID!): Symptom

    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;

export default typeDefs;
