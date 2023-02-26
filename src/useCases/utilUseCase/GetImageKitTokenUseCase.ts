import ImagekitSDK from '../../libraries/Imagkit';
import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';

import { env } from '../../config/env';

type constructorType = {
    imagekitSDK: ImagekitSDK;
};

export default class GetImageKitTokenUseCase {
    imagekitSDK: ImagekitSDK;

    constructor(args: constructorType) {
        this.imagekitSDK = args.imagekitSDK;
    }

    async exec(): Promise<GREInterface> {
        const response = new GenericResponseEntity();

        response.success = true;
        response.statusCode = 200;
        response.message = 'Get Imagekit token success';
        response.messageTitle = 'Get Imagekit token';
        response.data = {
            ...this.imagekitSDK.imagekit.getAuthenticationParameters(),
            publicKey: env.IMAGEKIT_PUBLIC_KEY,
        };

        return response;
    }
}
