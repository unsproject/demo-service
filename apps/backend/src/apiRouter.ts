import { MessageModel } from './model/messages';
import { UserModel } from './model/users';

const express = require('express');
const apiRouter = express.Router();

apiRouter.post('/getMessages/', async (req: any, res: any) => {
	const { serviceUserId } = await req.body;
	const user = await UserModel.findOne({ serviceUserId });
	if (!user) throw Error('No USER WITH THAT SERVICE ID');
	res.status(200).json(await MessageModel.find({ serviceUserId }));
});
apiRouter.post('/addMessage/', async (req: any, res: any) => {
	const { serviceUserId, name, text } = await req.body;
	const user = await UserModel.findOne({ serviceUserId });
	if (!user) throw Error('No USER WITH THAT SERVICE ID');
	res
		.status(200)
		.json(await MessageModel.create({ serviceUserId, name, text }));
});
export default apiRouter;
