import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import typeDefs from "./schemas/typeDefs.js";
import resolvers from "./schemas/resolvers.js";
import { authMiddleware } from "./utils/auth.js";

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/SymptomIQ";
  await mongoose.connect(MONGODB_URI);
  console.log("📊 Connected to MongoDB:", MONGODB_URI);

  await server.start();

  const app = express();

  app.use(
    "/graphql",
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }

        const allowedOrigins = ["https://symptom-iq-1.onrender.com"];

        const isLocalhostOrigin =
          /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

        if (isLocalhostOrigin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => authMiddleware({ req }),
    }),
  );

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "symptom-iq",
      timestamp: new Date().toISOString(),
      mongodb:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log("🚀 Apollo Server with Express running!");
    console.log(`   📍 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`   📍 Health check: http://localhost:${PORT}/health`);
  });
}

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});

startServer().catch(error => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
