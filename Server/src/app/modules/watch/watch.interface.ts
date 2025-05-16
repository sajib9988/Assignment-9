import { IJwtPayload } from "../auth/auth.interface";

declare module 'express' {
  interface Request {
    user?: IJwtPayload; // Optional property to match your auth middleware
  }
}
