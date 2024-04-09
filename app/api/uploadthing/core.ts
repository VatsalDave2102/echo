import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handlerAuth = async () => {
	const session = await auth();

	if (!session?.user.id) throw new UploadThingError("Unauthorized");

	return { userId: session.user.id };
};
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(() => handlerAuth())
		.onUploadComplete(() => {}),
	messageFile: f(["image", "pdf"])
		.middleware(() => handlerAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
