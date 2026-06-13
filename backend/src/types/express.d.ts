import { tokenPayload } from './jwt.types';
import { UserRole } from './roles.types';

declare global {
    namespace Express {
        interface Request {
            user?: tokenPayload;
            role?: UserRole;
            isAdmin?: boolean;
        }
    }
}
