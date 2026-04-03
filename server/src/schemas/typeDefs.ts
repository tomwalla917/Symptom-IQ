import { gql } from 'apollo-server-express';

const typeDefs = gql;`
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

    type Query {
    getSymptoms: [Symptom]
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
    }
`;

export default typeDefs;