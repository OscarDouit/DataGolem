import React, {useEffect, useState} from 'react';
import getStatusPage from "../../api/getStatusPage.js";

function StatusPage() {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        async function fetchData() {
            // You can await here
            const html = await getStatusPage();
            console.log(html);
            // ...
        }
        fetchData();
    }, []);

    return (
        <div>

        </div>
    );
}

export default StatusPage;