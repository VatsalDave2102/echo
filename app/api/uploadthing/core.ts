import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handlerAuth = () => {
	const { userId } = auth();

	if (!userId) throw new UploadThingError("Unauthorized");

	return { userId: userId };
};
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(() => handlerAuth())
		.onUploadComplete(() => {}),
	messageFile: f({
		image: { maxFileSize: "4MB", maxFileCount: 1 },
		pdf: { maxFileSize: "4MB", maxFileCount: 1 },
	})
		.middleware(() => handlerAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
