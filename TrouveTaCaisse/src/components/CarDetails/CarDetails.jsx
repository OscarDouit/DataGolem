import React from 'react';
import styles from './CarDetails.module.css';
import { FaCar, FaGasPump, FaTachometerAlt, FaCalendarAlt, FaCogs, FaRoad } from 'react-icons/fa';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const CarDetails = ({ car, onVote }) => {

  const handleLike = async(carId, type) => {
    await onVote(carId, type);
  };
  
  return (
    <div className={styles['car-details']}>
      <div className={styles['car-info']}>
        <h1 className={styles['car-title']}>
          {car.make} {car.model}
        </h1>

        <div className={styles['info-grid']}>
          <div className={styles['info-item']}>
            <FaCar className={styles.icon} />
            <span className={styles.label}>Marque</span>
            <span className={styles.value}>{car.make}</span>
          </div>

          <div className={styles['info-item']}>
            <FaCalendarAlt className={styles.icon} />
            <span className={styles.label}>Année</span>
            <span className={styles.value}>{car.year}</span>
          </div>

          <div className={styles['info-item']}>
            <FaGasPump className={styles.icon} />
            <span className={styles.label}>Carburant</span>
            <span className={styles.value}>{car.fuel}</span>
          </div>

          <div className={styles['info-item']}>
            <FaCogs className={styles.icon} />
            <span className={styles.label}>Transmission</span>
            <span className={styles.value}>{car.transmission}</span>
          </div>

          <div className={styles['info-item']}>
            <FaRoad className={styles.icon} />
            <span className={styles.label}>Type</span>
            <span className={styles.value}>{car.category}</span>
          </div>

          <div className={styles['info-item']}>
            <FaTachometerAlt className={styles.icon} />
            <span className={styles.label}>Consommation</span>
            <span className={styles.value}>{car.consumption}</span>
          </div>

          <div className={styles['info-item']}>
            <FaCogs className={styles.icon} />
            <span className={styles.label}>Cylindres</span>
            <span className={styles.value}>{car.cylinders}</span>
          </div>

          <div className={styles['info-item']}>
            <FaRoad className={styles.icon} />
            <span className={styles.label}>Transmission</span>
            <span className={styles.value}>{car.drive}</span>
          </div>
        </div>
      </div>

      <div className={styles['car-actions']}>
              <button 
                className={`${styles['vote-button']} ${car.userVote === 'like' ? styles.active : ''}`}
                onClick={() => handleLike(car.id, 'like')}
              >
                <FaThumbsUp /> <span>{car.likes || 0}</span>
              </button>
              <button 
                className={`${styles['vote-button']} ${car.userVote === 'dislike' ? styles.active : ''}`}
                onClick={() => handleLike(car.id, 'dislike')}
              >
                <FaThumbsDown /> <span>{car.dislikes || 0}</span>
              </button>
            </div>
    </div>
  );
};

export default CarDetails; 