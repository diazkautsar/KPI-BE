import Validator from 'validatorjs';
import { Connection, Types } from 'mongoose';

import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import CourseRepository from '../../repositories/Course.repository';
import ModuleRepository from '../../repositories/Module.repository';

import logger from '../../libraries/logger';

type constructorType = {
    conn: Connection;
    courseRepository: CourseRepository;
    moduleRepository: ModuleRepository;
};

export default class UpdateCourseUseCase {
    conn: Connection;
    courseRepository: CourseRepository;
    moduleRepository: ModuleRepository;

    constructor(args: constructorType) {
        this.conn = args.conn;
        this.courseRepository = args.courseRepository;
        this.moduleRepository = args.moduleRepository;
    }

    async exec(payload: any): Promise<GREInterface> {
        const response = new GenericResponseEntity();

        const bodyReq = payload.body ?? null;

        if (Object.keys(bodyReq).length === 0) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.message = 'Body request required';

            return response;
        }

        const rules = {
            id: 'string',
            name: 'string',
            description: 'string',
            cover_image: 'string',
            keyword: 'string',
            modules: 'array',
            is_active: 'boolean',
        };

        const validator = new Validator(bodyReq, rules);
        if (!validator.check()) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.data = validator.errors.all();

            return response;
        }

        const session = await this.conn.startSession();

        try {
            const { ObjectId } = Types;
            const idsModule = bodyReq.modules;

            if (Array.isArray(idsModule) && idsModule.length) {
                const validIds = idsModule.filter((id: any) => ObjectId.isValid(id));
                const invalidIds = idsModule.filter((id: any) => !ObjectId.isValid(id));

                if (invalidIds.length) {
                    response.statusCode = 400;
                    response.success = false;
                    response.messageTitle = 'Form Invalid';
                    response.message = `module ${invalidIds.join(', ')} not found`;

                    return response;
                }

                const modules = await this.moduleRepository.getModule({
                    _id: {
                        $in: validIds,
                    },
                });

                if (modules.length && modules.length !== validIds.length) {
                    const moduleIdNotFound: string[] = [];
                    validIds.forEach((element: string) => {
                        const idToFind = new ObjectId(element);
                        const dataDb = modules.find((item: any) => item._id.equals(idToFind));
                        if (!dataDb) {
                            moduleIdNotFound.push(element);
                        }
                    });

                    response.statusCode = 400;
                    response.success = false;
                    response.messageTitle = 'Form Invalid';
                    response.message = `modul ${moduleIdNotFound.join(', ')} not found`;

                    return response;
                }
            } else if (!Array.isArray(idsModule) || (Array.isArray(idsModule) && !idsModule.length)) {
                bodyReq.modules = undefined;
            }

            const filter = { _id: bodyReq.id };
            const update = bodyReq;

            const updated = await this.courseRepository.updateCourse(filter, update, session);

            session.endSession();

            response.success = true;
            response.statusCode = 201;
            response.messageTitle = 'Success update course';
            response.message = 'success update course';
            response.data = updated ?? null;
        } catch (error) {
            console.log(error);
            session.endSession();
            logger.error(error);
            response.success = false;
            response.statusCode = 500;
            response.messageTitle = 'Internal Server Error';
            response.message = 'internal server error';
        }

        return response;
    }
}
