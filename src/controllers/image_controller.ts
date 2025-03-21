import Elysia, { t } from "elysia";
import ObjectReader from "../utils/s3_object_reader";
import ObjectWriter from "../utils/s3_object_writer";
import s3 from "../s3";

const ImageController = new Elysia({
  prefix: "/api/image",
  tags: ["Image"],
});

ImageController.get("/:name", async ({ params }) => {
  const getter = new ObjectReader(s3);
  const image = await getter.getObjectAsImageWithHTTPHeaders(
    process.env.AWS_BUCKET as string,
    params.name
  );
  return image;
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
        type: "image/*"
      }),
    }),
    detail: {
      summary: "Upload image",
      description: "Upload image to S3 bucket",
    },
  }
);

export default ImageController;
