import axios from 'axios';

const getStatusPage = async () => {
    try {
        const response = await axios.get('https://g3qtl6mv.status.cron-job.org/');
        console.log('Status page:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching status page:', error);
        throw error;
    }
};

await getStatusPage();