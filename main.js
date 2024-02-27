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
		.on("ready", () => {
			console.log("Client :: ready");
			conn.exec(command, (err, stream) => {
				if (err) return res.status(500).send(err);

				stream
					.on("close", (code, signal) => {
						console.log(
							"Stream :: close :: code: " + code + ", signal: " + signal
						);
						conn.end();
						res.send("Command executed with code: " + code);
					})
					.on("data", (data) => {
						console.log("STDOUT: " + data);
					})
					.stderr.on("data", (data) => {
						console.log("STDERR: " + data);
					});
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
