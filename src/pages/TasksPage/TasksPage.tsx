import React, { useEffect, useState } from 'react';
import { startOfWeek, addWeeks, subWeeks, getISOWeek } from 'date-fns';
import {
  fetchTasks,
  selectTasks,
  selectTasksStatus,
} from '../../store/slices/tasksSlice';
import { ITask } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import TaskStatusPieChart from './TaskStatusPieChart';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  TextField,
  Box,
  Paper as MuiPaper,
	styled,
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import { darkThemeColors, lightThemeColors } from '../../colorsConst';
import { selectTheme } from '../../store/slices/themeSlice';

const Paper = styled(MuiPaper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  flex: 1,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&.dark': {
		color: darkThemeColors.text,
    backgroundColor: darkThemeColors.backgroundSecondary,
    borderColor: darkThemeColors.secondary,
  },
  '&.light': {
    backgroundColor: lightThemeColors.cardBackground,
    borderColor: lightThemeColors.secondary,
  },
}));

const TasksPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const tasks = useAppSelector(selectTasks);
  const status = useAppSelector(selectTasksStatus);
  const [weeks, setWeeks] = useState<number>(8);

  const themeColors = theme === 'dark' ? darkThemeColors : lightThemeColors;

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const getWeekNumber = (date: Date) => {
    return getISOWeek(date);
  };

  const calculateWeekData = (tasks: ITask[], weeks: number) => {
    const endDate = new Date();
    const startDate = subWeeks(endDate, weeks - 2);
    const data = [];

    for (let i = 0; i < weeks; i++) {
      const weekStart = addWeeks(startOfWeek(startDate), i);
      const weekEnd = addWeeks(weekStart, 1);

      const tasksInWeek = tasks.filter((task) => {
        const taskDate = new Date(task.date_created);
        return taskDate >= weekStart && taskDate < weekEnd;
      });

      const revenue = tasksInWeek.reduce(
        (sum, task) => sum + task.received_from_client,
        0
      );
      const expenses = tasksInWeek.reduce(
        (sum, task) =>
          sum +
          task.send_to_project_manager +
          task.send_to_account_manager +
          task.send_to_designer,
        0
      );

      data.push({
        week: `${t('Week')} ${getWeekNumber(weekStart)}`,
        revenue,
        expenses,
        profit: revenue - expenses,
      });
    }

    return data;
  };

  const data = calculateWeekData(tasks, weeks);

  if (status === 'loading') {
    return <div>{t('Loading')}</div>;
  }

  if (status === 'failed') {
    return <div>{t('Error')}</div>;
  }

  return (
    <Box maxWidth={1200} sx={{ margin: 'auto'}}>
      <Typography variant='h5' gutterBottom mt={4}>
        {t('Tasks Closed Over Month')}
      </Typography>
      <label>
        {t('Number of Weeks')}:
        <br />
        <TextField
          type='number'
          value={weeks === 0 ? '' : weeks}
          onChange={(e) => setWeeks(Number(e.target.value))}
          inputProps={{ min: '1' }}
          variant='outlined'
          size='small'
					sx={{
						'& input': {
							color: themeColors.text, 
							'&::placeholder': {
								color: themeColors.textSecondary, 
							},
						},
						'& .MuiOutlinedInput-root': {
							'& fieldset': {
								borderColor: themeColors.border, 
							},
							'&:hover fieldset': {
								borderColor: themeColors.borderHover,
							},
							'&.Mui-focused fieldset': {
								borderColor: themeColors.borderFocused,
							},
						},
					}}
				/>
      </label>
      <Box
        display='flex'
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent='space-between'
      >
        <Box
          width={{ xs: '100%', md: 'calc(50% - 16px)' }}
          mt={5}
          mb={{ xs: 2, sm: 0 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Paper className={theme} elevation={3}>
            <Typography variant='h5' gutterBottom>
              {t('Table of Revenue/Expenses')}
            </Typography>
            <ResponsiveContainer width='100%' height={400}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='week' />
                <YAxis domain={[0, 'auto']} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey='revenue'
                  fill={themeColors.tableRevenue}
                  name={t('Revenue')}
                />
                <Bar
                  dataKey='expenses'
                  fill={themeColors.tableExpenses}
                  name={t('Expenses')}
                />
                <Bar
                  dataKey='profit'
                  fill={themeColors.tableProfit}
                  name={t('Profit')}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
        <Box
          width={{ xs: '100%', md: 'calc(50% - 16px)' }}
          mt={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
				<Paper className={theme} elevation={3}>
          <TaskStatusPieChart weeks={weeks} tasks={tasks} />
				</Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default TasksPage;
