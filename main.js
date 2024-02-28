import express from "express";
import bodyParser from "body-parser";
import { Client } from "ssh2";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post("/execute-command", (req, res) => {
	const command = req.body.command;
	let conn = new Client();

	conn
		.on('error', (err) => {
			res.status(500).send('SSH Connection Error: ' + err.message);
		})
		.on("ready", () => {
			conn.exec(command, (err, stream) => {
				stream
					.on("data", () => {
						conn.end();
					})
			});
		})
		.connect({
			host: process.env.HOST_IP,
			port: 22,
			username: process.env.USERNAME,
			password: process.env.PASSWORD,
		});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
