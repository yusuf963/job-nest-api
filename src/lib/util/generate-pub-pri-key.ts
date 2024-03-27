import crypto from 'crypto';

/**
 * Generates RSA key pair asynchronously.
 * @usage
 * generateCredentials()
 *   .then((keys) => {
 *     console.log('Public Key:', keys.publicKey);
 *     console.log('Private Key:', keys.privateKey);
 *   })
 *   .catch((err) => {
 *     console.error('Error generating credentials:', err);
 *   });
 * @param {number} size - The modulus length for the RSA key pair (default: 2048).
 * @returns {Promise<KeyPair>} - Promise that resolves to a key pair object.
 */

interface KeyPair {
	publicKey: string | Buffer;
	privateKey: string;
}

function generateCredentials(size = 2048): Promise<KeyPair> {
	return new Promise<KeyPair>((resolve, reject) => {
		crypto.generateKeyPair('rsa', { modulusLength: size }, (err, pub, priv) => {
			if (err) {
				return reject(err);
			}
			return resolve({
				publicKey: pub.export({ type: 'pkcs1', format: 'pem' }),
				privateKey: priv.export({ type: 'pkcs1', format: 'pem' }) as string,
			});
		});
	});
}

function generateSignature(payload: string, privateKey: string) {
	const signer = crypto.createSign('rsa-sha256');
	signer.update(payload);
	signer.end();
	return signer.sign(privateKey);
}

function verifySignature(
	payload: string,
	signature: string,
	publicKey: string,
) {
	const verifier = crypto.createVerify('rsa-sha256');
	verifier.update(payload);
	verifier.end();
	return verifier.verify(publicKey, signature);
}

function GetChatRoom(arg0: { id: string }): any {
	throw new Error('Function not implemented.');
}

async function getChatRoomWithRetries(
	id: string,
	maxDelayMs = 32000,
	maxRetries = 10,
) {
	return new Promise(async (resolve, reject) => {
		let retryCount = 0;
		let delayMs = 1000;
		while (true) {
			try {
				return resolve(GetChatRoom({ id }));
			} catch (e) {
				if (retryCount++ > maxRetries) return reject(e);
				await new Promise((resolve) => {
					return setTimeout(resolve, delayMs);
				});
				delayMs *= 2;
				if (delayMs > maxDelayMs) delayMs = maxDelayMs;
			}
		}
	});
}
