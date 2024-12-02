import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import styles from './NotFound.module.css';

const NotFound = () => {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <h2 className={styles.subtitle}>Page non trouvée</h2>
                <p className={styles.description}>
                    Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <Button 
                    type="primary" 
                    icon={<HomeOutlined />} 
                    size="large" 
                    onClick={handleHome}
                    className={styles.button}
                >
                    Retour à l'accueil
                </Button>
            </div>
        </div>
    );
};

export default NotFound; 