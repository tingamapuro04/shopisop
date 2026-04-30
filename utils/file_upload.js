// import s3 client
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto';
import sharp from "sharp";
// import dotenv from "dotenv";

// dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const nameGenerator = (bytes) => {
  return crypto.randomBytes(bytes).toString("hex");
}

export const uploadFileToS3 = async (file) => {
  const resizedImage = await sharp(file.buffer).resize(1290, 1080).toBuffer();
  const filename = nameGenerator(12);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
    Body: resizedImage,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    return filename
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("File upload failed");
  }
};

// getting a signed URL for the file to be accessed
export const getImageUrl = async (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Expires: 60 * 60, // URL expires in 1 hour
  };

  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command);
    return url;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw new Error("Could not get signed URL");
  }
};