import { User } from "../entity/user";
import { UserDto, userDtoFactory } from "./user.dto";

export interface UserMeDto {
    user: UserDto | null;
    isAuthenticated: boolean;
}

export const userMeDtoFactory = (user: User | null): UserMeDto => {
    return {
        user: user === null ? null : userDtoFactory(user),
        isAuthenticated: user !== null
    }
}
