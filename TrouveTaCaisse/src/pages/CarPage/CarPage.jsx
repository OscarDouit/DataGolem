import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CarDetails from '../../components/CarDetails/CarDetails';
import CarComments from '../../components/CarComments/CarComments';
import styles from './CarPage.module.css';
import api from '../../api/axios';
import useUserStore from '../../store/userStore';

const CarPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();
  const searchState = location.state?.searchState;

  const handleUnauthorizedAction = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleBackToSearch = () => {
    // Si on a des critères de recherche, on retourne à la recherche en passant tous les critères dans la route
    if (searchState) {
      navigate('/search' + searchState);
    } else {
      navigate('/search');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carResponse, commentsResponse] = await Promise.all([
          api.get(`/cars/${id}`),
          api.get(`/cars/${id}/comments`)
        ]);
        console.log('carResponse:', carResponse.data);
        setCar(carResponse.data);
        setComments(commentsResponse.data);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async (content) => {
    try {
      if (!isAuthenticated) {
        handleUnauthorizedAction();
        return;
      }

      const response = await api.post(`/cars/${id}/comments`, { content });
      setComments([response.data, ...comments]);
    } catch (error) {
      // Erreur d'authentification on va rediriger vers la page de login
      if (error.response?.status === 401) {
        handleUnauthorizedAction();
        return;
      }
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  const handleVoteComment = async (commentId, type) => {
    try {
      if (!isAuthenticated) {
        handleUnauthorizedAction();
        return;
      }
  
      const response = await api.post(`/cars/${id}/comments/${commentId}/vote`, { type });
      setComments(comments.map(comment => 
        comment.id === commentId ? response.data : comment
      ));
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorizedAction();
        return;
      }
      console.error('Erreur lors du vote:', error);
    }
  };

  const handleVoteCar = async (commentId, type) => {
    try {
      if (!isAuthenticated) {
        handleUnauthorizedAction();
        return;
      }

      const response = await api.post(`/cars/${id}/vote`, { type });
      setCar(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorizedAction();
        return;
      }
      console.error('Erreur lors du vote:', error);
    }
  };

  if (loading) return <div className="loadingContainer"><Spin size="large" /></div>
  if (error) return <div className={styles.error}>{error}</div>;
  if (!car) return <div className={styles.error}>Voiture non trouvée</div>;

  return (
    <div className={styles.background}>
      <div className={styles['car-page']}>
        {searchState && (
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToSearch}
            className={styles.backButton}
            type="primary"
          >
            Retour aux résultats
          </Button>
        )}
        <div className={styles['content-container']}>
          <CarDetails 
            car={car}
            onVote={handleVoteCar}
          />
          <CarComments 
            comments={comments}
            onAddComment={handleAddComment}
            onVote={handleVoteComment}
          />
        </div>
      </div>
    </div>
  );
};

export default CarPage;