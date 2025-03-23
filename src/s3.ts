import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const config: S3ClientConfig = {
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  endpoint: process.env.AWS_ENDPOINT as string,
  forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === "true" ? true : false,
};
const s3 = new S3Client(config);
export default s3;
