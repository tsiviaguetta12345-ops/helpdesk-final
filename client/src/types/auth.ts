export interface LoginInput {
    username: string;
    password: string;
}

export interface AdminSession {
    token: string;
    username: string;
}
