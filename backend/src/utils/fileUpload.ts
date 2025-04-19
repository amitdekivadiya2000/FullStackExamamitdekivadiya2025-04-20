import path from 'path';
import fs from 'fs';

export const uploadImage = (file: any, folder: string = 'products'): string => {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../../uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.name);
    const filepath = path.join(uploadDir, filename);

    // Move file to uploads directory
    file.mv(filepath);

    // Return only the filename for database storage
    return filename;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

export const deleteImage = (filename: string, folder: string = 'products'): void => {
  try {
    const fullPath = path.join(__dirname, '../../uploads', folder, filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('File deletion error:', error);
  }
}; 