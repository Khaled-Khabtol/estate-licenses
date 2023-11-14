export enum Role {
    Admin = 'admin',
    User = 'user'
}

type User = {
    id: string;
    user_name: string;
    password: string,
    role: Role;
}

export interface IAuthenticate {
    user: User;
    token: string;
}