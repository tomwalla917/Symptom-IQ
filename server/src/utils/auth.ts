import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

const secret = process.env.JWT_SECRET || "supersecret";
const expiration = "2h";

// defines shape of user data inside token
interface UserPayload {
  _id: string;
  email: string;
}

// creates a TypeScript interface that is based on Express 'Request'
interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

// creates JWT
export const signToken = (user: UserPayload): string => {
  const payload = { _id: user._id, email: user.email };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

// finds token, verifies it, then attaches user data to request
export const authMiddleware = ({ req }: { req: AuthenticatedRequest }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token?.split(" ").pop()?.trim();
  }

  if (!token) {
    return req;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & {
      data: UserPayload;
    };

    req.user = decoded.data;
  } catch (err) {
    console.log("Invalid token");
  }

  return req;
};
