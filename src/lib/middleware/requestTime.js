function requestTime(req, _res, next) {
	req.requestTime = Date.now();
	next();
}

function requestTimeAlternative(option) {
	return (req, res, next) => {
		req.requestTime1 = Date.now();
		next();
	};
}

export { requestTime, requestTimeAlternative };
