import { AuthenticationError } from 'apollo-server-express';
import Symptom from '../models/Symptom';

const resolvers = {
    Query: {
        getSymptom: async (_: any, __: any, context: any) => {
            if (!context.user) throw new AuthenticationError('must be logged in');

            return await Symptom.find({ userId: context.user._id });
        },
    },
    Mutation: {
        addSymptom: async (_: any, args: any, context: any) => {
            if (!context.user) throw new AuthenticationError('must be logged in');

            return await Symptom.create({
                userId: context.user._id,
                ...args,
            });
        },

        updateSymptom: async (_: any, { id, ...args }: any, context: any) => {
            if (!context.user) throw new AuthenticationError('must be logged in');

            return await Symptom.findOneAndUpdate(
                { _id: id, userId: context.user._id }, //unique to the user
                { ...args },
                { new:true }
            );
        },

        deleteSymptom: async (_: any, { id }: any, context: any) => {
            if (!context.user) throw new AuthenticationError('must be logged in');

            return await Symptom.findOneAndDelete({
                _id:id, 
                userId: context.user._id,
            });

        },
    },
};

export default resolvers;