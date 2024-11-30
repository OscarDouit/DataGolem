import {Button, Menu, Dropdown, Avatar} from 'antd';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AppBar.css';
import {UserOutlined, LogoutOutlined} from "@ant-design/icons";
import useUserStore from '../../store/userStore';
import api from '../../api/axios.js';

const navItems = [
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
    const { user, isAuthenticated, isLoading, checkAuth, logout } = useUserStore();

    const handleLogout = async () => {
        try {
            await api.post('/users/logout', {}, { withCredentials: true });
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    const userMenuItems = [
        {
            key: 'logout',
            label: 'Déconnexion',
            icon: <LogoutOutlined />,
            onClick: handleLogout
        }
    ];

    useEffect(() => {
        checkAuth();
    }, []);

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
            <img 
                src="https://static.vecteezy.com/system/resources/previews/000/623/448/original/auto-car-logo-template-vector-icon.jpg" 
                alt="logo" 
                onClick={handleHome} 
                className="logo" 
            />

            
            <div className="menu-container">
                <Menu 
                    id={'menu'} 
                    onClick={onClick} 
                    selectedKeys={[current]} 
                    mode="horizontal" 
                    items={navItems} 
                />
            </div>

            <div className="login-container">
                {isLoading ? (
                    <span>Chargement...</span>
                ) : isAuthenticated && user ? (
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <div className="user-avatar-container">
                            <Avatar icon={<UserOutlined />} className="user-avatar" />
                            <span className="user-pseudo">{user.pseudo}</span>
                        </div>
                    </Dropdown>
                ) : (
                    <Button 
                        id={'login-button'} 
                        icon={<UserOutlined style={{color: 'white'}} />} 
                        type="text" 
                        onClick={handleLogin} 
                    />
                )}
            </div>
        </div>
    );
}

export default AppBar;