"use client";

import Image from "next/image";
import { FileIcon, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { MessageFileSchema, ServerFormSchema } from "@/schemas";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";

interface FileUploadProps<T extends FieldValues> {
	endpoint: "serverImage" | "messageFile";
	value: string;
	onChange: (url?: string) => void;
	setError: UseFormSetError<T>;
	fieldName: Path<T>;
}
export const FileUpload = <T extends {}>({
	endpoint,
	value,
	onChange,
	setError,
	fieldName,
}: FileUploadProps<T>) => {
	const fileType = value?.split(".").pop();

	// if already there's an image
	if (value && fileType !== "pdf") {
		return (
			<div className="relative h-20 w-20">
				<Image fill src={value} alt="Upload" className="rounded-full" />
				<button
					onClick={() => onChange("")}
					className="bg-red-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm hover:bg-red-500/90 transition-colors"
					type="button"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		);
	}

	// if attachment is an pdf
	if (value && fileType === "pdf") {
		return (
			<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
				<FileIcon className="h-10 w-10 fill-rose-200 stroke-rose-400" />
				<a
					href={value}
					target="_black"
					rel="noopener noreferrer"
					className="ml-2 text-sm text-rose-500 dark:text-rose-400 hover:underline"
				>
					{value}
				</a>
				<button
					onClick={() => onChange("")}
					className="bg-red-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm hover:bg-red-500/90 transition-colors"
					type="button"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		);
	}
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				onChange(res?.[0].url);
			}}
			onUploadError={(error: UploadThingError<Json>) => {
				if (error.code === "TOO_LARGE") {
					setError(fieldName, {
						message: "File too large, upload less than 4MB",
					});
				}
				console.log(error);
			}}
			className="ut-button:bg-rose-500 ut-label:text-rose-500 dark:border-zinc-300 ut-uploading:ut-button:bg-rose-800 hover:cursor-pointer ut-allowed-content:dark:text-zinc-300"
		/>
	);
};
