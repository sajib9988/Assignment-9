

export type  IJwtPayload={
    userId?: string 
    email: string;
    password?: string;
    role: string;
    iat?: number;
    exp?: number;
}