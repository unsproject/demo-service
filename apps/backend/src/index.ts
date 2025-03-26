import express, { Express, Response, Request, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { DBImplementation } from './db';
import cors from 'cors';
import apiRouter from './apiRouter';
import { gatewayApp } from '@unsproject/service-gateway/dist/api';

const app: Express = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
app.use(
	cors({
		origin: '*',
		methods: '*',
		allowedHeaders: '*'
	})
);
mongoose.connect(process.env.MONGO_URI as string, { dbName: 'Gateway' });

const connection = mongoose.connection;
app.use(express.json());
app.use(
	'/uns-service-gateway',
	express.static(path.join(__dirname, 'build-gateway'))
);
app.use('/', express.static(path.join(__dirname, 'build')));
app.use(
	'/uns/gateway/api',
	gatewayApp(
		server,
		new DBImplementation(),
		process.env.GATEKEEPER_URL || 'https://gatekeeper.universalnameservice.com'
	)
);

app.use('/api', apiRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	res.status(500).json({ error: error.message });
});

connection.once('open', () => {
	console.log('MongoDB connection established successfully');
});

server.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
