import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Box,
  useMediaQuery,
  IconButton,
  Menu,
  styled,
  FormControlLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { darkThemeColors, lightThemeColors } from '../../colorsConst';
import { selectTheme, toggleTheme } from '../../store/slices/themeSlice';
import { selectLocale, setLocale } from '../../store/slices/localeSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { useWeek } from '../../hooks/useWeek'

const Header: React.FC = () => {
  const { i18n } = useTranslation();
	const workWeek = useWeek()
  const dispatch = useAppDispatch();
  const locale = useAppSelector(selectLocale);
  const theme = useAppSelector(selectTheme);
  const isMobile = useMediaQuery('(max-width:620px)');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLocaleChange = (event: SelectChangeEvent<string>) => {
    const newLocale = event.target.value;
    dispatch(setLocale(newLocale));
    i18n.changeLanguage(newLocale);
  };

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&::before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const themeColors = theme === 'dark' ? darkThemeColors : lightThemeColors;

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      MenuListProps={{
        style: {
          backgroundColor: themeColors.backgroundSecondary,
          color: themeColors.text,
        },
      }}
    >
      <MenuItem>
        <FormControlLabel
          control={<MaterialUISwitch sx={{ m: 1 }} checked={theme === 'dark'} onChange={() => dispatch(toggleTheme())} />}
          label={i18n.t('Theme')}
        />
      </MenuItem>
      <MenuItem>
        <FormControl variant='outlined'>
          <InputLabel>{i18n.t('Language')}</InputLabel>
          <Select
            value={locale}
            onChange={handleLocaleChange}
            label={i18n.t('Language')}
          >
            <MenuItem value='en'>English</MenuItem>
            <MenuItem value='ru'>Русский</MenuItem>
          </Select>
        </FormControl>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position='static'
      style={{ backgroundColor: themeColors.primary, color: themeColors.text }}
    >
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='menu'
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            {renderMenu}
            <Box display={'flex'} marginLeft={"40px"} gap={'30px'}>
              <Link
                to='/'
                style={{
                  color: themeColors.text,
                  textDecoration: 'none',
                }}
              >
                {i18n.t('Main')}
              </Link>
              <Link
                to='/tasks'
                style={{
                  color: themeColors.text,
                  textDecoration: 'none',
                }}
              >
                {i18n.t('Tasks')}
              </Link>
              <Link
                to='/designers'
                style={{
                  color: themeColors.text,
                  textDecoration: 'none',
                }}
              >
                {i18n.t('Designers')}
              </Link>
            </Box>
          </>
        ) : (
          <>
            <FormControl variant='outlined'>
              <InputLabel>{i18n.t('Language')}</InputLabel>
              <Select
                value={locale}
                onChange={handleLocaleChange}
                label={i18n.t('Language')}
              >
                <MenuItem value='en'>English</MenuItem>
                <MenuItem value='ru'>Русский</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<MaterialUISwitch sx={{ m: 1 }} checked={theme === 'dark'} onChange={() => dispatch(toggleTheme())} />}
              label={''}
            />
            <Box display='flex' marginLeft='20px' gap={3}>
              <Link
                to='/'
                style={{
                  color: themeColors.text,
                  textDecoration: 'none',
                }}
              >
                {i18n.t('Main')}
              </Link>
              <Link
                to='/tasks'
                style={{
                  color: themeColors.text,
                  textDecoration: 'none',
                }}
              >
                {i18n.t('Tasks')}
              </Link>
              <Link
                to='/designers'
                style={{
                  color: themeColors.text,
                  textDecoration: 'none',
                }}
              >
                {i18n.t('Designers')}
              </Link>
            </Box>
            <Box marginLeft='auto' color={themeColors.text}>
              {i18n.t('Work Week')}: {workWeek}
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

