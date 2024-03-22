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
