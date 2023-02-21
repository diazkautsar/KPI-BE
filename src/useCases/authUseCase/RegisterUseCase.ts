import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';

type constructorType = {};

export default class RegisterUseCase {
    constructor(args: constructorType) {}

    async exec(): Promise<GREInterface> {
        const response = new GenericResponseEntity();

        return response;
    }
}
