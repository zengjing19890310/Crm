module.exports = {
	timeFormatter(timeStamp) {
		let prependZero = (value) => {
			return value<10?"0"+value:value;
		};
	    let date = new Date(timeStamp);
		return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()} ${prependZero(date.getHours())}:${prependZero(date.getMinutes())}`;
	}
};