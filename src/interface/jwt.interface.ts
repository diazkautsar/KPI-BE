import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
    id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    role_slug: string;
    is_active: boolean;
    is_blocked: boolean | null | undefined;
}
