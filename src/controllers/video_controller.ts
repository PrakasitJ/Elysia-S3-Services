import Elysia, { t } from "elysia";
import ObjectReader from "../utils/s3_object_reader";
import s3 from "../s3";
import ObjectWriter from "../utils/s3_object_writer";

const VideoController = new Elysia({
    prefix: "/api/video",
    tags: ["Video"],
});

VideoController.get("/:name", async ({ params }) => {
    const video = new ObjectReader(s3);
    const videoFile = await video.getObjectAsVideo(
        process.env.AWS_BUCKET as string,
        params.name
    );
    return videoFile;
}, {
    detail: {
        summary: "Get video",
        description: "Get video from S3 bucket"
    }
});

VideoController.post("/", async ({ body }) => {
    const video = new ObjectWriter(s3);
    const videoFile = await video.putObject(
        process.env.AWS_BUCKET as string,
        body.name,
        body.file,
        body.type
    );
    return videoFile;
}, {
    body: t.Object({
        name: t.String(),
        file: t.File({
            type: "video/*"
        }),
        type: t.Optional(
            t.String()
        )
    }),
    detail: {
        summary: "Upload video",
        description: "Upload video to S3 bucket"
    }
});

export default VideoController;
