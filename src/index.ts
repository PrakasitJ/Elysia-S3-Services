import { Elysia, redirect } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import ImageController from "./controllers/image_controller";

const app = new Elysia();
app.use(cors());
app.use(
  swagger({
    documentation: {
      info: {
        title: "PrakasitJ S3 API",
        version: "0.6.3",
      },
      tags: [{ name: "Image", description: "Image operations" }],
    },
    path: "/docs",
  })
);
app.use(ImageController);
app.get("/", () => redirect("/docs"));
app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
