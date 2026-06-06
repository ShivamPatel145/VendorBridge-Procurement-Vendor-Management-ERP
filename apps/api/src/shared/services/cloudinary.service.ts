import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env';

const hasCloudinaryEnv =
  !!(env.CLOUDINARY_CLOUD_NAME &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_API_SECRET);

if (hasCloudinaryEnv) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('⚠️ Cloudinary environment variables are missing. Using mock file upload service.');
}

export class CloudinaryService {
  public static async uploadBuffer(
    buffer: Buffer,
    folder: string,
    filename: string,
    resourceType: 'raw' | 'image' | 'auto' = 'auto'
  ): Promise<{ url: string; publicId: string }> {
    if (!hasCloudinaryEnv) {
      const sanitizedFilename = filename.replace(/\s+/g, '_');
      console.log(`[MOCK UPLOAD] Mock uploading file "${filename}" to folder "${folder}"`);
      return {
        url: `https://res.cloudinary.com/demo/image/upload/mock_${Date.now()}_${sanitizedFilename}`,
        publicId: `mock_${Date.now()}`,
      };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: filename.split('.')[0] + '_' + Date.now(),
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary upload result is undefined'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      uploadStream.end(buffer);
    });
  }
}

export default CloudinaryService;
