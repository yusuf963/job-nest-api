import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: process.env.EMAIL_SECURE,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const emailOptions = {
		from: `Job tal: <${process.env.EMAIL_USER}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	await transporter.sendMail(emailOptions);
};

export { sendEmail };
