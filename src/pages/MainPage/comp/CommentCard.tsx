import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { IComment } from '../../../types';
import { useTranslation } from 'react-i18next';
import { enUS, ru } from 'date-fns/locale';
import { Box, Typography } from '@mui/material';

interface CommentCardProps {
  comment: IComment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const { t } = useTranslation();
  const language = localStorage.getItem('language') || 'en';

  return (
    <Box display="flex" alignItems="center" marginBottom="30px" border="1px solid #ccc" borderRadius={5} padding="10px">
      <img src={comment.designer.avatar} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '12px' }} />
      <Box flex="1">
        <Typography variant="body1" sx={{ marginBottom: '2px', fontWeight: 'bold' }}>
          {comment.designer.username}
        </Typography>
        <Typography variant="body2" sx={{ color: '#333', fontSize: '0.875rem', marginBottom: '4px' }}>
          {formatDistanceToNow(new Date(comment.date_created), { locale: language === 'ru' ? ru : enUS })} {t('Time Ago')}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '4px' }}>
          {t('Task')}: {comment.issue}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '4px' }}>
          {t('Message')}: {comment.message}
        </Typography>
      </Box>
    </Box>
  );
};

export default CommentCard;


