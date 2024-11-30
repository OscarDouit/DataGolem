import React, { useState } from 'react';
import styles from './CarComments.module.css';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const CarComments = ({ comments, onAddComment, onVote }) => {
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (commentId, type) => {
    onVote(commentId, type);
  };

  return (
    <div className={styles['comments-section']}>
      <h2 className={styles.title}>Commentaires</h2>
      
      <form onSubmit={handleSubmitComment} className={styles['comment-form']}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className={styles['comment-input']}
        />
        <button 
          type="submit" 
          disabled={isLoading || !newComment.trim()}
          className={styles['submit-button']}
        >
          {isLoading ? 'Envoi...' : 'Commenter'}
        </button>
      </form>

      <div className={styles['comments-list']}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles['comment-header']}>
              <span className={styles.username}>{comment.user.pseudo}</span>
              <span className={styles['comment-date']}>
                {`${new Date(comment.createdAt).toLocaleDateString('fr-FR')} à ${new Date(comment.createdAt).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}`}
              </span>
            </div>
            <p className={styles['comment-content']}>{comment.content}</p>
            <div className={styles['comment-actions']}>
              <button 
                className={`${styles['vote-button']} ${comment.userVote === 'like' ? styles.active : ''}`}
                onClick={() => handleLike(comment.id, 'like')}
              >
                <FaThumbsUp /> <span>{comment.likes || 0}</span>
              </button>
              <button 
                className={`${styles['vote-button']} ${comment.userVote === 'dislike' ? styles.active : ''}`}
                onClick={() => handleLike(comment.id, 'dislike')}
              >
                <FaThumbsDown /> <span>{comment.dislikes || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarComments;