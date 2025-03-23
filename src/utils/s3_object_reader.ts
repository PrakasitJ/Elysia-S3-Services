import {
  GetObjectCommand,
  GetObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";

class ObjectReader {
  constructor(private s3: S3Client) { }

  async getObject(
    bucket: string,
    key: string
  ): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const data = await this.s3.send(command);
    return data;
  }

  async getObjectAsImage(bucket: string, key: string): Promise<File> {
    const data = await this.getObject(bucket, key);
    const image = await data.Body?.transformToByteArray();
    if (!image) {
      throw new Error("Image not found");
    }
    return new File([image], key, { type: data.ContentType });
  }

  async getObjectAsImageWithHTTPHeaders(
    bucket: string,
    key: string
  ): Promise<Response> {
    const data = await this.getObject(bucket, key);
    const image = await data.Body?.transformToByteArray();
    if (!image) {
      throw new Error("Image not found");
    }
    if (!data.ContentType?.includes("image")) {
      throw new Error("Invalid image file");
    }
    const file = new File([image], key, { type: data.ContentType });
    return new Response(image, {
      headers: {
        "Content-Type": file.type,
        "Content-Length": file.size.toString(),
        "Cache-Control": "public, max-age=31536000",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  async getObjectAsVideo(bucket: string, key: string): Promise<File> {
    const data = await this.getObject(bucket, key);
    const video = await data.Body?.transformToByteArray();
    if (!video) {
      throw new Error("Video not found");
    }
    if (!data.ContentType?.includes("video")) {
      throw new Error("Invalid video file");
    } 
    return new File([video], key, { type: data.ContentType });
  }
}

export default ObjectReader;
