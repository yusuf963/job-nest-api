import { promisify } from 'util';

const timeToSleep = promisify(setTimeout);
async function sleep(durationByms) {
	console.log('Start');
	await timeToSleep(durationByms);
	console.log('End');
}

const advanceTime = (durationByms) => {
	const originalDateNow = Date.now;
	Date.now = originalDateNow() + durationByms;
};

function mountTime({ duration, operator }) {
	switch (operator) {
		case '+':
			// new Date().getTime() + duration;
			Date.now() + duration;
			break;
		case '-':
			new Date().getTime() - duration;
		// Date.now() - duration;
	}
}

export { sleep, advanceTime, mountTime };

//https://github.com/bbc/tvr-web-experimentation/blob/08419d372ff1f41c095d05f4ee377bac9b09b242/test/client.js#L49
