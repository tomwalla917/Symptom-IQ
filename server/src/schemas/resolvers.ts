import { GraphQLError } from "graphql";
import Symptom from "../models/Symptom.js";
import User from "../models/User.js";
import { signToken } from "../utils/auth.js";

const resolvers = {
  Query: {
    getSymptoms: async (_: any, __: any, context: any) => {
      if (!context.user) throw new GraphQLError("must be logged in");

      return await Symptom.find({ userId: context.user._id });
    },
    getSymptom: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new GraphQLError("must be logged in");
      return await Symptom.findOne({ _id: id, userId: context.user._id });
    },
  },
  Mutation: {
    register: async (
      _parent: any,
      args: { username: string; email: string; password: string },
    ) => {
      const existingUser = await User.findOne({ email: args.email }).lean();
      if (existingUser) {
        throw new GraphQLError("Email already in use");
      }

      const user = await User.create({
        username: args.username.trim(),
        email: args.email.trim(),
        password: args.password.trim(),
      });

      const token = signToken({ _id: user._id.toString(), email: user.email });

      return {
        token,
        user,
      };
    },

    login: async (_: any, args: { email: string; password: string }) => {
      const user = await User.findOne({ email: args.email });

      if (!user) {
        throw new GraphQLError("Invalid email or password");
      }
      const correctPw = await user.comparePassword(args.password);

      if (!correctPw) {
        throw new GraphQLError("Invalid email or password");
      }

      const token = signToken({
        _id: user._id.toString(),
        email: user.email,
      });

      return {
        token,
        user,
      };
    },

    addSymptom: async (_: any, args: any, context: any) => {
      if (!context.user) throw new GraphQLError("must be logged in");

      return await Symptom.create({
        userId: context.user._id,
        ...args,
      });
    },

    updateSymptom: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.user) throw new GraphQLError("must be logged in");

      return await Symptom.findOneAndUpdate(
        { _id: id, userId: context.user._id }, //unique to the user
        { ...args },
        { new: true },
      );
    },

    deleteSymptom: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new GraphQLError("must be logged in");

      return await Symptom.findOneAndDelete({
        _id: id,
        userId: context.user._id,
      });
    },
  },
};

export default resolvers;
