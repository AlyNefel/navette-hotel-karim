import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Upload a base64 or URL image to Cloudinary under the "tours" folder.
 */
export async function uploadTourImage(
  file: string,
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder: 'hotel-karim/tours',
    public_id: publicId,
    overwrite: true,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteTourImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
