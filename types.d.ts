import {AuthenticatedUser} from "@resources/auth/types/authenticatedUser";

declare module 'express' {
    interface Request {
        user: AuthenticatedUser;
    }

    interface Response {
      locals: {
        csrfToken: string;
      }
    }
}
