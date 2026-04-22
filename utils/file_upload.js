// import s3 client
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
const filename = nameGenerator(12);
export const uploadFileToS3 = async (file) => {
  // resize the image to instangram profile picture size (110x110) using sharp
  const resizedImage = await sharp(file.buffer).resize(1290, 1080).toBuffer();

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