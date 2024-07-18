import React from 'react';
import { IComment } from '../../../types';
import CommentCard from './CommentCard';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { darkThemeColors, lightThemeColors } from '../../../colorsConst';
import { useAppSelector } from '../../../hooks/hooks';
import { selectTheme } from '../../../store/slices/themeSlice';

interface CommentsListProps {
  comments: IComment[];
}

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  const { t } = useTranslation();
  const theme = useAppSelector(selectTheme);
  const themeColors = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <Box maxWidth={1240} mx="auto" p={2} >
      <Typography variant="h5" gutterBottom mb={4} sx={{ color: themeColors.text }}>
        {t('Last 10 Comments')}
      </Typography>
      {comments.slice(0, 10).map(comment => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </Box>
  );
};

export default CommentsList;



