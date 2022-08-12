import express from 'express';

const port = 3333;
const app = express();

app.get('/oauth2callback', (req, res) =>
	res.send(`<h1>${req.query.code}</h1>`)
);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
