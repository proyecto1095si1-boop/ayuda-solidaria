import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder = 'ayuda-solidaria') {
    if (!file) throw new BadRequestException('No se recibió archivo');

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({
            url: result?.secure_url,
            publicId: result?.public_id,
            format: result?.format,
          });
        },
      );
      stream.end(file.buffer);
    });
  }

  async uploadDocument(file: Express.Multer.File, folder = 'ayuda-solidaria/docs') {
    if (!file) throw new BadRequestException('No se recibió archivo');

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({
            url: result?.secure_url,
            publicId: result?.public_id,
          });
        },
      );
      stream.end(file.buffer);
    });
  }
}
