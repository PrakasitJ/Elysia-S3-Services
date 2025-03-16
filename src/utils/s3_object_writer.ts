import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";

class ObjectWriter {
  constructor(private s3: S3Client) {}

  async putObject(
    bucket: string,
    key: string,
    body: File,
    contentType?: string
  ): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: (await body.arrayBuffer()) as any,
      ContentType: contentType || body.type,
    });
    const data = await this.s3.send(command);
    return data;
  }
}

export default ObjectWriter;
