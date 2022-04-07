/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useContext } from "react";

import { SocketContext } from "../providers";

const useApp = () => useContext(SocketContext);

export default useApp;
