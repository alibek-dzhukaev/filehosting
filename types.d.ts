import {AuthenticatedUser} from "./src/resources/auth/types/authenticatedUser";

declare module 'express' {
    interface Request {
        user: AuthenticatedUser;
    }
}