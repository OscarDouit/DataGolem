import {Button, Dropdown, Avatar, Input} from 'antd';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AppBar.css';
import {UserOutlined, LogoutOutlined, SearchOutlined} from "@ant-design/icons";
import useUserStore from '../../store/userStore';
import api from '../../api/axios.js';

const AppBar = () => {
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading, checkAuth, logout } = useUserStore();

    const handleSearch = async (value) => {
        navigate(`/search?q=${encodeURIComponent(value)}`);
    };

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

            <div className="search-container">
                <Input.Search
                    placeholder="Rechercher un véhicule..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="middle"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                    className="search-input"
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