/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";

const useRoom = () => {
	const router = useRouter();

	const direction = router.query.channel ? "channel" : "direct";
	const directionId = router.query[direction];

	return {
		direction,
		directionId,
	};
};

export default useRoom;
