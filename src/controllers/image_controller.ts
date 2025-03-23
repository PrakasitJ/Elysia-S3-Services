import Elysia, { t } from "elysia";
import ObjectReader from "../utils/s3_object_reader";
import ObjectWriter from "../utils/s3_object_writer";
import s3 from "../s3";

const ImageController = new Elysia({
  prefix: "/api/v1/image",
  tags: ["Image"],
});

ImageController.get("/*", async ({ params }) => {
  try {
    const getter = new ObjectReader(s3);
    const image = await getter.getObjectAsImageWithHTTPHeaders(
      process.env.AWS_BUCKET as string,
      params["*"]
    );
    if (!image) {
      throw new Error("Image not found");
    }
    return image;
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }
}, {
  detail: {
    summary: "Get image",
    description: "Get image from S3 bucket"
  }
});

ImageController.post(
  "/",
  async ({ body }) => {
    const writer = new ObjectWriter(s3);
    const image = await writer.putObject(
      process.env.AWS_BUCKET as string,
      body.name,
      body.file,
      body.type
    );
    return image;
  },
  {
    body: t.Object({
      name: t.String(),
      type: t.Optional(t.String()),
      file: t.File({
        type: "image/*",
        error: {
          type: "invalid_file_type",
          message: "Invalid image file type"
        }
      }),
    }),
    detail: {
      summary: "Upload image",
      description: "Upload image to S3 bucket",
    },
  }
);

export default ImageController;
