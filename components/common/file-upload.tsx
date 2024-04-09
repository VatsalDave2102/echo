"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
	endpoint: "serverImage" | "messageFile";
	value: string;
	onChange: (url?: string) => void;
}
export const FileUpload: React.FC<FileUploadProps> = ({
	endpoint,
	value,
	onChange,
}) => {
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
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				onChange(res?.[0].url);
			}}
			onUploadError={(error: Error) => {
				console.log(error);
			}}
			className="ut-button:bg-rose-500 ut-label:text-rose-500"
		/>
	);
};
