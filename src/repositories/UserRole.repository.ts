import userRoleModel from '../models/userRole.model';

export default class UserRoleRepository {
    async getRoleBySlug(slug: string) {
        try {
            return await userRoleModel.findOne({ slug });
        } catch (error) {
            return null;
        }
    }
}
