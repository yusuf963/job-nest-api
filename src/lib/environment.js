let environment;
const devBaseURL = 'http://localhost';
const prodBaseURL = 'https://remote';

const dev = {
	userLogin: 'http://localhost:5000/login',
	userRegister: 'http://localhost:5000/register',
	userDelete: 'http://localhost:5000/user/:id',
	userUpdate: 'http://localhost:5000/user/:id',
	usersGetAll: '/user',
	itemGetAll: 'http://localhost:5000/item',
	itemGetOne: 'http://localhost:5000/item/:id',
	itemDelete: 'http://localhost:5000/item/:id',
	itemUpdate: 'http://localhost:5000/item/:id',
	itemCreate: 'http://localhost:5000/item/:id',
};

export default environment = dev;
