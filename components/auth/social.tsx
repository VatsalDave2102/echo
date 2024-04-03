import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "../ui/button";

export const Social = () => {
	// TODO: apply provider sign in
	return (
		<div className="flex w-full items-center gap-x-2">
			{/* Button for google signin */}
			<Button className="w-full" variant="outline" size="lg" onClick={() => {}}>
				<FcGoogle className="w-5 h-5" />
			</Button>

			{/* Button for github signin */}
			<Button className="w-full" variant="outline" size="lg" onClick={() => {}}>
				<FaGithub className="w-5 h-5" />
			</Button>
		</div>
	);
};
