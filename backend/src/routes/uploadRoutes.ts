import express, { Request, Response } from 'express';
import { upload, uploadToCloudinary } from '../utils/upload';
import { auth } from '../middleware/auth';

const router = express.Router();

// Define interface for multer request
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

router.post('/image', auth, upload.single('image'), async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const imageUrl = await uploadToCloudinary(req.file);
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router; 