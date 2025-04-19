import { Request } from 'express';
import { FileArray } from 'express-fileupload';

declare module 'express' {
  interface Request {
    files?: FileArray;
  }
} 