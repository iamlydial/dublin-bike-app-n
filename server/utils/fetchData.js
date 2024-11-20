const axios = require('axios');

async function fetchData() {
    const url = 'https://app-media.noloco.app/noloco/dublin-bikes.json';
    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log('Fetched dataset:', data);
        return data; 
    } catch (error) {
        console.error('Error fetching dataset:', error);
        throw error;
    }
}

module.exports = fetchData;
