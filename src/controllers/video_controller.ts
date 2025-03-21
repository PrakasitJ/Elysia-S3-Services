import Elysia, { t } from "elysia";
import ObjectReader from "../utils/s3_object_reader";
import s3 from "../s3";
import ObjectWriter from "../utils/s3_object_writer";

const VideoController = new Elysia({
    prefix: "/api/video",
    tags: ["Video"],
});

VideoController.get("/:name", async ({ params }) => {
    try {
        const video = new ObjectReader(s3);
        const data = await video.getObject(
            process.env.AWS_BUCKET as string,
            params.name
        );
        
        if (!data.Body) {
            throw new Error("Video not found");
        }

        const videoData = await data.Body.transformToByteArray();
        return new Response(videoData, {
            headers: {
                "Content-Type": data.ContentType || "video/mp4",
                "Content-Length": data.ContentLength?.toString() || "",
                "Cache-Control": "public, max-age=31536000",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
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
