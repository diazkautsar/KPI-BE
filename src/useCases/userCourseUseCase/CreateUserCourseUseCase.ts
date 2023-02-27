import Validator from 'validatorjs';
import { Connection, Types } from 'mongoose';

import { GREInterface } from '../../interface/response.interface';
import { UserCourseInterface } from '../../interface/userCourse.interface';

import GenericResponseEntity from '../../entities/GenericResponseEntity';
import logger from '../../libraries/logger';

import UserCourseRepository from '../../repositories/UserCourse.repository';
import CourseRepository from '../../repositories/Course.repository';
import UserRepository from '../../repositories/User.repository';
import UserRoleRepository from '../../repositories/UserRole.repository';
import { ROLE_LEARNER } from '../../constants';

type constructorType = {
    conn: Connection;
    userCourseRepository: UserCourseRepository;
    courseRepository: CourseRepository;
    userRepository: UserRepository;
    userRoleRepository: UserRoleRepository;
};

export default class CreateUserCourseUseCase {
    conn: Connection;
    userCourseRepository: UserCourseRepository;
    courseRepository: CourseRepository;
    userRepository: UserRepository;
    userRoleRepository: UserRoleRepository;

    constructor(args: constructorType) {
        this.conn = args.conn;
        this.userCourseRepository = args.userCourseRepository;
        this.courseRepository = args.courseRepository;
        this.userRepository = args.userRepository;
        this.userRoleRepository = args.userRoleRepository;
    }

    async exec(payload: any): Promise<GREInterface> {
        const response = new GenericResponseEntity();

        const bodyReq = payload.body;

        const rules = {
            course_id: 'required|string',
            users: 'required|array',
            start_date: 'required|string',
            end_date: 'required|string',
        };

        const validator = new Validator(bodyReq, rules);
        if (!validator.check()) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.data = validator.errors.all();

            return response;
        }

        // start validate course id
        const { ObjectId } = Types;
        const isValidCourseId = ObjectId.isValid(bodyReq.course_id);
        if (!isValidCourseId) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.message = `course ${bodyReq.course_id} not found`;

            return response;
        }

        const courseDetail = await this.courseRepository.getCourse({
            id: bodyReq.course_id,
        });
        if (!courseDetail) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.message = `course ${bodyReq.course_id} not found`;

            return response;
        }
        // env validate course id

        const roleLearner = await this.userRoleRepository.getRoleBySlug(ROLE_LEARNER);

        // start validate users
        const userIds = bodyReq.users;
        const validUserIds = userIds.filter((id: any) => ObjectId.isValid(id));
        const inValidUserIds = userIds.filter((id: any) => !ObjectId.isValid(id));

        if (inValidUserIds.length) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.message = `users ${inValidUserIds.join(', ')} not found`;

            return response;
        }

        const users = await this.userRepository.getUsers({
            _id: {
                $in: validUserIds,
            },
            user_role: roleLearner?.id,
        });
        if (users.length && users.length !== validUserIds.length) {
            const userIdNotFound: string[] = [];
            validUserIds.forEach((v: string) => {
                const idToFind = new ObjectId(v);
                const dataDb = users.find((item: any) => item._id.equals(idToFind));
                if (!dataDb) {
                    userIdNotFound.push(v);
                }
            });

            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.message = `users ${userIdNotFound.join(', ')} not found`;

            return response;
        } else if (!users.length) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.message = `users ${validUserIds.join(', ')} not found`;

            return response;
        }
        // env validate users

        const session = await this.conn.startSession();
        try {
            const payloadUserCourse: UserCourseInterface = {
                course_id: bodyReq.course_id,
                users: bodyReq.users,
                start_date: bodyReq.start_date,
                end_date: bodyReq.end_date,
            };
            const inserted = await this.userCourseRepository.addUserCourse(payloadUserCourse, session);

            session.endSession();

            response.success = true;
            response.statusCode = 201;
            response.messageTitle = 'Success create user course';
            response.message = 'success create user course';
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
