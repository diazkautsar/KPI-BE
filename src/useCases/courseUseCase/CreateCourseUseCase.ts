import Validator from 'validatorjs';
import { Connection, Types } from 'mongoose';

import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import { CourseInterface } from '../../interface/course.interface';

import CourseRepository from '../../repositories/Course.repository';
import ModuleRepository from '../../repositories/Module.repository';

import logger from '../../libraries/logger';

type constructorType = {
    conn: Connection;
    courseRepository: CourseRepository;
    moduleRepository: ModuleRepository;
};

export default class CreateCourseUseCase {
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

        const bodyReq = payload.body;
        const user = payload.user;
        const rules = {
            name: 'required|string',
            description: 'required|string',
            cover_image: 'string',
            keyword: 'string',
            modules: 'required|array',
        };

        const validator = new Validator(bodyReq, rules);
        if (!validator.check()) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.data = validator.errors.all();

            return response;
        }

        // start validate modules
        const { ObjectId } = Types;
        const idsModule = bodyReq.modules;
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

        // validate exisiting module with same name
        const checkExisting = await this.courseRepository.getCourse({
            name: bodyReq.name,
        });
        if (Array.isArray(checkExisting) && checkExisting.length) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.message = 'course already exist';

            return response;
        }
        // end validate exisiting module with same name

        const session = await this.conn.startSession();

        try {
            const payloadCourse: CourseInterface = {
                name: bodyReq.name,
                description: bodyReq.description,
                cover_image: bodyReq.cover_image,
                modules: bodyReq.modules,
                keyword: bodyReq.keyword,
                created_by: user.name,
                created_by_id: user.id,
            };

            const inserted = await this.courseRepository.addCourse(payloadCourse, session);

            session.endSession();

            response.success = true;
            response.statusCode = 201;
            response.messageTitle = 'Success create module';
            response.message = 'success create module';
            response.data = inserted ?? null;
        } catch (error) {
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
