const express = require('express');

const app = express();

app.use(express.static('./dist/kral-kutu-frontend'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/kral-kutu-frontend/'}),
);

app.listen(process.env.PORT || 8080);

