import { Client } from "ssh2";
import dotenv from "dotenv";

dotenv.config();
let conn = new Client();
conn
	.on("ready", function () {
		console.log("Client :: ready");
		conn.exec("ls", function (err, stream) {
			if (err) throw err;
			stream
				.on("close", function (code, signal) {
					console.log(
						"Stream :: close :: code: " + code + ", signal: " + signal
					);
					conn.end();
				})
				.on("data", function (data) {
					console.log("STDOUT: " + data);
				})
				.stderr.on("data", function (data) {
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
