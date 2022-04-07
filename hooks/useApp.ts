/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useContext } from "react";

import { AppContext } from "../providers";

const useApp = () => useContext(AppContext);

export default useApp;
