const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { router} = require("./routes/schema.js");
const dataRoutes = require('./routes/data.js');

const app = express();
const PORT = 3000;

//cors
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/schema', router);

app.get('/get-data', dataRoutes);
app.use('/data', dataRoutes);

console.log(dataRoutes);
app.use('/data/:id', dataRoutes);
app.delete('/data/:id', dataRoutes);
app.put('/data/:id', dataRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
