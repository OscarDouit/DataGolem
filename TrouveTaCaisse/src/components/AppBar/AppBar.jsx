
import { Menu } from 'antd';
import {useState} from "react";
import './AppBar.css';

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

    const onClick = (e) => {
        setCurrent(e.key);
    };

    return (
        // mettre un logo sur la guche et le menu au centre
        <div className="app-bar">
            <img src="https://static.vecteezy.com/system/resources/previews/000/623/448/original/auto-car-logo-template-vector-icon.jpg" alt="logo" className="logo" />
            <div className="menu-container">
                <Menu id={'menu'} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            </div>
        </div>
    );
}

export default AppBar;