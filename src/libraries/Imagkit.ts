import ImageKit from 'imagekit';
import { env } from '../config/env';

export default class ImagekitSDK {
    imagekit: ImageKit;

    constructor() {
        this.imagekit = new ImageKit({
            publicKey: env.IMAGEKIT_PUBLIC_KEY,
            privateKey: env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
        });
    }
}
