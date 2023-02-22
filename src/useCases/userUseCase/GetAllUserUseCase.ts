import { GREInterface } from '../../interface/response.interface';
import GenericResponseEntity from '../../entities/GenericResponseEntity';
import UserRepository from '../../repositories/User.repository';

type constructorType = {
    userRepository: UserRepository;
};

export default class GetAllUserUseCase {
    userRepository: UserRepository;

    constructor(args: constructorType) {
        this.userRepository = args.userRepository;
    }

    async exec({
        is_active = true,
        is_blocked = false,
    }: {
        is_active?: boolean;
        is_blocked?: boolean;
    }): Promise<GREInterface> {
        console.log(is_active, is_blocked);
        const response = new GenericResponseEntity();

        const users = await this.userRepository.getUsers({ is_active, is_blocked });

        response.success = true;
        response.statusCode = 200;
        response.message = 'Get Users';
        response.messageTitle = 'Get Users';
        response.data = await this.mappingResponse(users);

        return response;
    }

    async mappingResponse(data: any[]) {
        return data.map((item) => ({
            _id: item._id,
            name: item.name,
            email: item.email,
            username: item.username,
            user_role: {
                id: item.user_role._id,
                title: item.user_role.title,
                slug: item.user_role.slug,
            },
            is_active: item.is_active,
            is_blocked: item.is_blocked,
            created_by: item?.created_by,
            created_by_id: item?.created_by_id,
        }));
    }
}
