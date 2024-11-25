const express = require('express');
const bodyParser = require('body-parser');
const schemaRoutes = require('./routes/schema.js');
const dataRoutes = require('./routes/data.js');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/schema', schemaRoutes);
app.use('/data', dataRoutes);
console.log(schemaRoutes);
console.log(dataRoutes);
app.use('/data/:id', dataRoutes);
app.delete('/data/:id', dataRoutes);
app.put('/data/:id', dataRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
