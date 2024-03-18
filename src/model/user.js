import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
	firstName: { type: 'string', required: false, minLength: 2, maxLength: 30 },
	lastName: { type: 'string', required: false, minLength: 2, maxLength: 30 },
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 2,
		maxLength: 30,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		minLength: 10,
		maxLength: 50,
		match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
	},
	isTermsAgreed: { type: Boolean, required: true },
	isVerified: { type: Boolean, required: false, default: false },
	password: {
		type: String,
		required: [true, 'Password is required'],
		minLength: 8,
		maxLength: 100,
		match: [
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character',
		],
	},
	image: {
		type: String,
		required: false,
	},
	phone: { type: String, required: false, minLength: 6, maxLength: 30 },
	skills: { type: Array, required: false },
	bio: { type: String, required: false, minLength: 6, maxLength: 300 },
	sex: { type: String, required: false },
	isAdmin: { type: Boolean, default: false },
	address: {
		street: { type: String, required: false, minLength: 3, maxLength: 100 },
		city: { type: String, required: false, minLength: 3, maxLength: 50 },
		area: { type: String, required: false, minLength: 3, maxLength: 50 },
		postCode: { type: String, required: false, minLength: 3, maxLength: 50 },
		country: { type: String, required: false, minLength: 2, maxLength: 50 },
	},
	createdAt: { type: Date, required: true, default: Date.now, immutable: true },
	updatedAt: { type: Date, required: true, default: Date.now },
	lastLogin: { type: Date, required: false, default: Date.now },
});
//eslint-disable-next-line
userSchema.pre('save', function (next) {
	this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
	next();
});
//eslint-disable-next-line
userSchema.methods.validatePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
