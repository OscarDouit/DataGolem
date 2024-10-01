import {Button, Menu} from 'antd';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AppBar.css';
import {UserOutlined} from "@ant-design/icons";

const items = [
    {
        key: '1',
        label: (
            <a rel="noopener noreferrer">
                Découvrir
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a rel="noopener noreferrer">
                Rechercher
            </a>
        ),
    },
    {
        key: '3',
        label: (
            <a rel="noopener noreferrer">
                Apprendre
            </a>
        ),
    },
]

const AppBar = () => {
    const [current, setCurrent] = useState('1');
    const navigate = useNavigate();

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const handleLogin = () => {
        navigate('/login');
    }

    const handleHome = () => {
        navigate('/');
    }

    return (
        <div className="app-bar">
            {/* Logo à gauche */}
            <img src="https://static.vecteezy.com/system/resources/previews/000/623/448/original/auto-car-logo-template-vector-icon.jpg" alt="logo" onClick={handleHome} className="logo" />

            {/* Menu centré */}
            <div className="menu-container">
                <Menu id={'menu'} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            </div>

            {/* Conteneur pour le bouton de connexion */}
            <div className="login-container">
                <Button id={'login-button'} icon={<UserOutlined style={{color: 'white'}} />} type="text" onClick={handleLogin} />
            </div>
        </div>
    );
}

export default AppBar;