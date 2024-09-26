import {User} from "../entity/user";

export class UserDto {
    id: number;
    pseudo: string;
    email: string;

    static fromEntity(user: User): UserDto {
        const userDto = new UserDto();
        userDto.id = user.id;
        userDto.pseudo = user.pseudo;
        userDto.email = user.email;
        return userDto;
    }
}
