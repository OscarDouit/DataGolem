import {User} from "../entity/user";

export interface UserDto {
    id: number;
    pseudo: string;
    email: string;
}

export const userDtoFactory = (user: User): UserDto => {
    return {
        id: user.id,
        pseudo: user.pseudo,
        email: user.email
    };
}
