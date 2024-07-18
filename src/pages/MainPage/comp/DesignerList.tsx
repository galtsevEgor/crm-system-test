import React from 'react';
import { IDesigner } from '../../../types';
import DesignerCard from './DesignerCard';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Box } from '@mui/material';
import { useAppSelector } from '../../../hooks/hooks';
import { selectTheme } from '../../../store/slices/themeSlice';
import { darkThemeColors, lightThemeColors } from '../../../colorsConst';

interface DesignersListProps {
  topDesigners: IDesigner[];
}

const DesignersList: React.FC<DesignersListProps> = ({ topDesigners }) => {
  const { t } = useTranslation();
  const theme = useAppSelector(selectTheme);
  const themeColors = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const boxStyles = {
    backgroundColor: themeColors.background,
    border: `1px solid ${themeColors.backgroundSecondary}`,
    padding: '16px',
    marginTop: '16px', 
  };

  return (
    <Box sx={boxStyles}>
      <Typography variant="h5" mb={2} sx={{ color: themeColors.text }}>
        {t('Top 10 Designers')}
      </Typography>
      <Grid container spacing={2}>
        {topDesigners.map((designer) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={designer.username}>
            <DesignerCard designer={designer} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DesignersList;




