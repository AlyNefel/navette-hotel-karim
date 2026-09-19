import { NextResponse } from 'next/server';
import { uploadTourImage } from '@/lib/cloudinary';

// POST: upload an image to Cloudinary and return the URL + publicId
export async function POST(request: Request) {
  try {
    const { file } = await request.json(); // file = base64 data URL

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const { url, publicId } = await uploadTourImage(file);
    return NextResponse.json({ url, publicId });
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
