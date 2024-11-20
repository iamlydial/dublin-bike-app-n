const express = require('express');
const fetchData = require('../utils/fetchData');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const filters = req.body.filters || {};
        const data = await fetchData();
        console.log('Fetched data:', data);
        
        let filteredData = data;
        for (const key in filters) {
            filteredData = filteredData.filter((item) => item[key] === filters[key]);
        }

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;
