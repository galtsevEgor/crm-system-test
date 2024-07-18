import React, { lazy, useEffect, useState } from 'react';
import { CircularProgress, MenuItem, Select, SelectChangeEvent, Typography, Box, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  selectTopDesigners,
  selectMainPageStatus,
  selectMainPageError,
  fetchTopDesigners,
  sortByMedianTime,
  sortByTotalTasksCompleted,
} from '../../store/slices/mainPageSlice';
import {
  selectComments,
  selectCommentsStatus,
  selectCommentsError,
  fetchComments,
} from '../../store/slices/commentsSlice';
import { useTranslation } from 'react-i18next';
import { darkThemeColors, lightThemeColors } from '../../colorsConst';
import { selectTheme } from '../../store/slices/themeSlice'
import DesignersList from './comp/DesignerList'

const CommentsList = lazy(() => import('./comp/CommentsList'));

const MainPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const topDesigners = useAppSelector(selectTopDesigners);
  const mainPageStatus = useAppSelector(selectMainPageStatus);
  const mainPageError = useAppSelector(selectMainPageError);

  const comments = useAppSelector(selectComments);
  const commentsStatus = useAppSelector(selectCommentsStatus);
  const commentsError = useAppSelector(selectCommentsError);

  const { t } = useTranslation();
  const [sortType, setSortType] = useState('medianTime');
  const theme = useAppSelector(selectTheme);
  const themeColors = theme === 'dark' ? darkThemeColors : lightThemeColors;

  useEffect(() => {
    dispatch(fetchTopDesigners('?limit=10'));
    dispatch(fetchComments('?ordering=-date_created&limit=10'));
  }, [dispatch]);

  useEffect(() => {
    if (sortType === 'medianTime') {
      dispatch(sortByMedianTime());
    } else if (sortType === 'totalTasksCompleted') {
      dispatch(sortByTotalTasksCompleted());
    }
  }, [sortType, dispatch]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortType(event.target.value);
  };

  if (mainPageStatus === 'loading' || commentsStatus === 'loading') {
    return <CircularProgress />;
  }

  if (mainPageStatus === 'failed' || commentsStatus === 'failed') {
    return <Typography color="error">{mainPageError || commentsError}</Typography>;
  }

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4, lg: 6 },
        maxWidth: '100%',
        margin: '0 auto',
        '@media (min-width: 620px)': {
          maxWidth: 'calc(100% - px)',
        },
        '@media (min-width: 960px)': {
          maxWidth: 'calc(100% - 64px)',
        },
        '@media (min-width: 1240px)': {
          maxWidth: '1240px',
        },
      }}
    >
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, backgroundColor: themeColors.cardBackground }}>
        <Typography variant="h5" gutterBottom sx={{ color: themeColors.text }}>
          {t('Sort by:')}
        </Typography>
        <Select
      value={sortType}
      onChange={handleSortChange}
      variant="outlined"
      fullWidth
      sx={{
        marginBottom: 2,
        color: themeColors.text,
        border: `1px solid ${themeColors.border}`, 
        '&:hover': {
          border: `1px solid ${themeColors.borderHover}`,
        },
        '&.Mui-focused': {
          border: `1px solid ${themeColors.borderFocused}`,
        },
      }}
    >
      <MenuItem value="medianTime" sx={{ color: '#222' }}>
        {t('Sort by MT')}
      </MenuItem>
      <MenuItem value="totalTasksCompleted" sx={{ color: '#222' }}>
        {t('Sort by TT')}
      </MenuItem>
    </Select>
      </Paper>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, backgroundColor: themeColors.cardBackground }}>
        <DesignersList topDesigners={topDesigners} />
      </Paper>
      <Paper elevation={3} sx={{ padding: 2, backgroundColor: themeColors.cardBackground }}>
        <CommentsList comments={comments} />
      </Paper>
    </Box>
  );
};

export default MainPage;


