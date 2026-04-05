import { gql } from '@apollo/client';

export const ME_QUERY = gql`
    query Me {
        me {
            _id
            username
            email
        }
    }
`;

export const GET_SYMPTOMS = gql`
    query getSymptoms {
        getSymptoms {
            _id
            symptomType
            severity
            createdAt
        }
    }
`;

export const GET_SYMPTOM = gql`
    query getSymptom($id: ID!) {
        getSymptom(id: $id) {
            _id
            userId
            symptomType
            severity
            duration
            possibleTrigger
            notes
            createdAt
        }
    }
`;

export const REGISTER_MUTATION = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const DELETE_SYMPTOM_MUTATION = gql`
    mutation deleteSymptom($id: ID!) {
        deleteSymptom(id:$id){
        _id
        userId
        symptomType
        severity
        duration
        possibleTrigger
        notes
        createdAt
        }
    }
`;

export const ADD_SYMPTOM_MUTATION = gql`
    mutation addSymptom($userId: ID!, $symptomType: String!, $severity: Int!,
    $duration: String!, $possibleTrigger: String, $notes: String) {
        addSymptom(userId: $userId, symptomType: $symptomType, severity: $severity,
        duration: $duration, possibleTrigger: $possibleTrigger, notes: $notes) {
            _id
            userId
            symptomType
            severity
            duration
            possibleTrigger
            notes
            createdAt
        }
    }
`;

export const UPDATE_SYMPTOM_MUTATION = gql`
    mutation updateSymptom($id: ID!, $userId: ID!, $symptomType: String!, $severity: Int!,
    $duration: String!, $possibleTrigger: String, $notes: String) {
        updateSymptom(id: $id, userId: $userId, symptomType: $symptomType, severity: $severity,
        duration: $duration, possibleTrigger: $possibleTrigger, notes: $notes) {
            _id
            userId
            symptomType
            severity
            duration
            possibleTrigger
            notes
            createdAt
        }
    }
`;