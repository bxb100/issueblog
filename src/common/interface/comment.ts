import {IUser} from './user';

export interface IComment {
    id: number;
    user: IUser | null;
    body?: string;
}
