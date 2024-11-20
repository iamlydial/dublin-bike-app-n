const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.get('/', (req, res) => {
    res.json({ message: "Schema endpoint" });
});

module.exports = router;