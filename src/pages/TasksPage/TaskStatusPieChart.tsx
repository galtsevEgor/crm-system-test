import { startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ITask } from '../../types';
import { useTranslation } from 'react-i18next';
import { NameType } from 'recharts/types/component/DefaultTooltipContent';
import { Box, Typography } from '@mui/material'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

interface TaskStatusPieChartProps {
  weeks: number;
  tasks: ITask[];
}

const TaskStatusPieChart: React.FC<TaskStatusPieChartProps> = ({ weeks, tasks }) => {
  const { t } = useTranslation();

  const calculateWeekData = (tasks: ITask[], weeks: number) => {
    const endDate = new Date();
    const startDate = subWeeks(endDate, weeks - 1);
    const data: ITask[] = [];

    for (let i = 0; i < weeks; i++) {
      const weekStart = addWeeks(startOfWeek(startDate), i);
      const weekEnd = addWeeks(weekStart, 1);

      const tasksInWeek = tasks.filter((task) => {
        const taskDate = new Date(task.date_created);
        return taskDate >= weekStart && taskDate < weekEnd;
      });

      data.push(...tasksInWeek);
    }

    return data;
  };

  const filteredTasks = calculateWeekData(tasks, weeks);

  const getStatusCounts = (tasks: ITask[]) => {
    const statusCounts: { [key: string]: number } = {};

    tasks.forEach((task) => {
      if (statusCounts[task.status]) {
        statusCounts[task.status]++;
      } else {
        statusCounts[task.status] = 1;
      }
    });

    return Object.keys(statusCounts).map((status) => ({
      status,
      count: statusCounts[status],
    }));
  };

  const data = getStatusCounts(filteredTasks);

  const language = localStorage.getItem('language') || 'en';

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const localizeStatus = (status: NameType) => {
    return t(`${status}`, { lng: language });
  };

  return (
    <Box sx={{ padding: 2, marginBottom: 2 }}>
      <Typography variant="h5" gutterBottom>
        {t('Percentage of Task Statuses')}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, localizeStatus(name)]} />
          <Legend formatter={(value) => t(value)} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TaskStatusPieChart;

