import express from 'express';

const port = 3333;
const app = express();

app.get('/oauth2callback', (req, res) => {
	const authCode = req.query.code;
	console.log(`> [youtube-robot] Consent given: ${authCode}`);

	res.send(`<h1>Your auth code: ${authCode}</h1>`);
});

app.listen(port, () => {
	console.log(`> [youtube-robot] Listening on http://localhost:${port}`);
});
