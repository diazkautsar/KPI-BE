import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import { CourseInterface } from '../../interface/course.interface';
import CourseRepository from '../../repositories/Course.repository';
import logger from '../../libraries/logger';

type constructorType = {
    courseRepository: CourseRepository;
};

export default class GetCourseUseCase {
    courseRepository: CourseRepository;

    constructor(args: constructorType) {
        this.courseRepository = args.courseRepository;
    }

    async exec(id: string[] | string | null | undefined, is_active: boolean = true): Promise<GREInterface> {
        const response = new GenericResponseEntity();
        try {
            const payload: { [K: string]: any } = {
                is_active,
            };

            if (Array.isArray(id) && id.length) {
                payload['_id'] = {
                    $in: id,
                };
            } else if (!Array.isArray(id) && id && id.length) {
                payload['_id'] = id;
            }

            const data = await this.courseRepository.getCourse(payload);

            response.success = true;
            response.statusCode = 200;
            response.message = 'Get Course';
            response.messageTitle = 'Get Course';
            response.data = await this.toResponse(data);

            return response;
        } catch (error) {
            logger.error(error);
            response.success = false;
            response.statusCode = 500;
            response.messageTitle = 'Internal Server Error';
            response.message = 'internal server error';
        }

        return response;
    }

    async toResponse(data: [] | { [K: string]: any }[]): Promise<CourseInterface[] | []> {
        return data.map((item: { [K: string]: any }) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            cover_image: item.cover_image,
            keyword: item.keyword,
            modules: item.modules,
            is_active: item.is_active ?? null,
            created_by: item.created_by ?? null,
            created_by_id: item.created_by_id ?? null,
        }));
    }
}
