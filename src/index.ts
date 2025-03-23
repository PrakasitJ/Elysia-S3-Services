import { Elysia, redirect } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import ImageController from "./controllers/image_controller";
import VideoController from "./controllers/video_controller";

const app = new Elysia();
app.use(cors());
app.use(
  swagger({
    documentation: {
      info: {
        title: "PrakasitJ S3 API",
        version: "0.6.3",
      },
      tags: [
        { name: "Image", description: "Image operations" },
        { name: "Video", description: "Video operations" },
      ],
    },
    path: "/docs",
  })
);
app.use(ImageController);
app.use(VideoController);
app.get("/", () => redirect("/docs"));
app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
