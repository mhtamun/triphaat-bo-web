require('dotenv').config();

const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT) || 5679;
const dev = process.env.NODE_ENV === 'development';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.all('*', (req, res) => handle(req, res));

    server.listen(port, error => {
        if (error) throw error;

        console.debug(`> Ready on http://0.0.0.0:${port}`);
    });
});
