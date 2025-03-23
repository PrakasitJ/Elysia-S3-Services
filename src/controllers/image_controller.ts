import Elysia, { t } from "elysia";
import ObjectReader from "../utils/s3_object_reader";
import ObjectWriter from "../utils/s3_object_writer";
import s3 from "../s3";

const ImageController = new Elysia({
  prefix: "/api/v1/image",
  tags: ["Image"],
});

ImageController.get("/", async () => {
  return new Response(JSON.stringify({ message: "Please provide a key to get image", key: "api/v1/image/:key", example: "api/v1/image/images/1234567890.jpg" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}, {
  detail: {
    summary: "Get image",
    description: "Get image from S3 bucket\n\nPlease provide a key to get image\n\nExample: api/v1/image/images/1234567890.jpg"
  }
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
      description: "Upload image to S3 bucket\n\n name can be nested folder\n\nExample: images/1234567890.jpg ",
    },
  }
);

ImageController.get("/list", async () => {
  const getter = new ObjectReader(s3);
  const images = await getter.getImageList(process.env.AWS_BUCKET as string, "");
  return new Response(JSON.stringify(images), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}, {
  detail: {
    summary: "Get image list",
    description: "Get image list from S3 bucket\n\nPlease provide a key to get image list\n\nExample: api/v1/image/list/images"
  }
});

ImageController.get("/list/*", async ({ params }) => {
  const getter = new ObjectReader(s3);
  const images = await getter.getImageList(process.env.AWS_BUCKET as string, params["*"]);
  return new Response(JSON.stringify(images), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}, {
  detail: {
    summary: "Get image list",
    description: "Get image list from S3 bucket\n\nPlease provide a key to get image list\n\nExample: api/v1/image/list/images"
  }
});

export default ImageController;
