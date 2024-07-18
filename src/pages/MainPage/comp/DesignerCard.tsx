import React from 'react';
import { IDesigner } from '../../../types';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Avatar } from '@mui/material';
import { darkThemeColors, lightThemeColors } from '../../../colorsConst';
import { useAppSelector } from '../../../hooks/hooks';
import { selectTheme } from '../../../store/slices/themeSlice';

interface DesignerCardProps {
  designer: IDesigner;
}

const DesignerCard: React.FC<DesignerCardProps> = ({ designer }) => {
  const { t } = useTranslation();
  const theme = useAppSelector(selectTheme);
  const themeColors = theme === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <Card sx={{ backgroundColor: themeColors.cardBackground }}>
      <CardContent>
        <Avatar src={designer.avatar} alt="Avatar" />
        <Typography variant="h5" component="div" gutterBottom sx={{ color: themeColors.text }}>
          {designer.username}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: themeColors.text }}>
          {t('Median Time')}: {designer.medianTime!.toFixed(2)} ч
        </Typography>
        <Typography variant="body1" sx={{ color: themeColors.text }}>
          {t('Tasks Completed')}: {designer.totalTasksCompleted}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DesignerCard;

