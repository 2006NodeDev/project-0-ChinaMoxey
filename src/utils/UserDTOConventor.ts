import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/User";

export function UserDTOConvertor( udto:UserDTO):User{
    return {
        userId:udto.userId,
        username:udto.username,
        password:udto.password,
        firstName:udto.firstname,
        lastName:udto.lastname,
        email: udto.email,
        role:{
            role: udto.role,
            role_id: udto.role_Id

        }

    }
}