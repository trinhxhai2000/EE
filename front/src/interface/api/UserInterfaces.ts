export interface UserItem {
    id: number;
    username: string;
    password?: string;
    role: USER_ROLE
}

export interface UserTableData {
    rows: UserItem[];
    rowsCount: number;
}

export interface DeleteRowsParam {
    rows: UserItem[];
}

export enum USER_ROLE {
    ADMIN = 'admin',
    USER = 'user',
}