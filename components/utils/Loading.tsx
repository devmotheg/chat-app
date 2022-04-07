/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Watch } from "react-loader-spinner";

const Loading = () => {
	return (
		<div className="my-8 mx-auto w-fit">
			<Watch color="rgb(30 41 59)" height={60} width={60} />
			<span className="mx-auto mt-1 block w-fit font-bold capitalize text-slate-800">
				loading...
			</span>
		</div>
	);
};

export default Loading;
