const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/:city', async (req, res, next) => {
    try {
        const city = req.params.city;
        const apiKey = process.env.WEATHER_API_KEY;
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
