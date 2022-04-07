/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const messageDate = (date: string) =>
	new Date(date).toLocaleString("en-us", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

export default messageDate;
