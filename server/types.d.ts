export interface user {
    id: string;
    firstName: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: user
        }
    }
}