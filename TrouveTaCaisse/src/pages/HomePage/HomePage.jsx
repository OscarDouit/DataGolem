import './HomePage.css';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const [subTitle, setSubTitle] = useState(null); // Texte initial
    const [animationClass, setAnimationClass] = useState(''); // Classe pour contrôler l'animation

    useEffect(() => {
        setSubTitle('Présente');
        // Démarrer l'animation de roulement après 3 secondes
        const timer = setTimeout(() => {
            setAnimationClass('roll-up'); // Lancer l'animation de roulement vers le haut
        }, 2000);
        // Changer le texte et lancer l'animation d'entrée après un délai
        const secondTimer = setTimeout(() => {
            setSubTitle('Le futur de la recherche automobile');
            setAnimationClass('roll-in'); // Lancer l'animation de roulement vers le bas
        }, 2300); // Délai après la première animation

        // faire un roll up du texte et en afficher un autre après un délai
        const thirdTimer = setTimeout(() => {
            setAnimationClass('roll-up'); // Lancer l'animation de roulement vers le haut
        }, 5300); // Délai après la deuxième animation

        // Remettre le texte initial et lancer l'animation d'entrée après un délai
        const fourthTimer = setTimeout(() => {
            const discoverButton = <button className={'discover-button'}>Découvrir</button>;
            setSubTitle(discoverButton);
            setAnimationClass('roll-in'); // Lancer l'animation de roulement vers le bas
        }, 5600); // Délai après la troisième animation

        return () => {
            clearTimeout(timer);
            clearTimeout(secondTimer);
            clearTimeout(thirdTimer);
        };
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <video
                autoPlay
                muted
                loop
                id="porsche_video"
                preload="auto"
                style={{
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    top: 0,
                    left: 0,
                    zIndex: -1
                }}
            >
                <source src="porsche.webm" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="overlay-text">
                <div className="main-title">
                    LuxuryDriveHub
                </div>
                <div className={`sub-title ${animationClass}`}>
                    {subTitle}
                </div>
            </div>
        </div>
    );
}

export default HomePage;