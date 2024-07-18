import React, { useState, useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import {
	selectDesigners,
	selectDesignersStatus,
	selectDesignersError,
	selectCurrentPage,
	selectSortBy,
	setPage,
	setSortBy,
	fetchDesigners,
} from '../../store/slices/designersSlice'
import { IDesigner } from '../../types'
import { useTranslation } from 'react-i18next'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	CircularProgress,
	Typography,
	Box,
	Card,
	CardContent,
	CardHeader,
	SelectChangeEvent,
} from '@mui/material'
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material'
import { selectTheme } from '../../store/slices/themeSlice'
import { darkThemeColors, lightThemeColors } from '../../colorsConst'

const DesignersTable: React.FC = () => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const designers = useAppSelector(selectDesigners)
	const status = useAppSelector(selectDesignersStatus)
	const error = useAppSelector(selectDesignersError)
	const currentPage = useAppSelector(selectCurrentPage)
	const sortBy = useAppSelector(selectSortBy)
	const theme = useAppSelector(selectTheme)
	const themeColors = theme === 'dark' ? darkThemeColors : lightThemeColors

	const [localStatusFilter, setLocalStatusFilter] = useState<string | null>(
		null
	)
	const [filteredDesigners, setFilteredDesigners] = useState<IDesigner[]>([])

	const handlePageChange = useCallback(
		(newPage: number) => {
			dispatch(setPage(newPage))
		},
		[dispatch]
	)

	const handleSortChange = useCallback(
		(newSortBy: string) => {
			dispatch(setSortBy(newSortBy))
		},
		[dispatch]
	)

	const handleStatusFilterChange = useCallback(
		(e: SelectChangeEvent<string>) => {
			const statusValue =
				(e.target.value as string) === '' ? null : (e.target.value as string)
			setLocalStatusFilter(statusValue)
		},
		[]
	)

	useEffect(() => {
		const fetchData = async () => {
			dispatch(fetchDesigners({ page: currentPage, sortBy }))
		}

		fetchData()
	}, [dispatch, currentPage, sortBy])

	useEffect(() => {
		let sortedDesigners = [...designers]

		switch (localStatusFilter) {
			case 'totalTasksCompleted':
				sortedDesigners.sort(
					(a, b) => (b.totalTasksCompleted || 0) - (a.totalTasksCompleted || 0)
				)
				break
			case '-totalTasksCompleted':
				sortedDesigners.sort(
					(a, b) => (a.totalTasksCompleted || 0) - (b.totalTasksCompleted || 0)
				)
				break
			case 'inProgressTasks':
				sortedDesigners.sort(
					(a, b) => (b.inProgressTasks || 0) - (a.inProgressTasks || 0)
				)
				break
			case '-inProgressTasks':
				sortedDesigners.sort(
					(a, b) => (a.inProgressTasks || 0) - (b.inProgressTasks || 0)
				)
				break
			default:
				break
		}

    if (localStatusFilter) {
      sortedDesigners = sortedDesigners.filter((designer) => {
        if (localStatusFilter === 'Busy') {
          return designer.inProgressTasks && designer.inProgressTasks > 0;
        }
        if (localStatusFilter === 'Free') {
          return designer.inProgressTasks === 0;
        }
        return true;
      });
    }
		setFilteredDesigners(sortedDesigners)
	}, [designers, sortBy, localStatusFilter])

	if (status === 'loading') {
		return (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				height='100vh'
			>
				<CircularProgress />
			</Box>
		)
	}

	if (status === 'failed') {
		return (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				height='100vh'
			>
				<Typography variant='h6' color='error'>
					{t('Error')}: {error}
				</Typography>
			</Box>
		)
	}

	return (
		<Box p={2} style={{ backgroundColor: themeColors.background }}>
			<Typography variant='h4' gutterBottom style={{ color: themeColors.text }}>
				{t('Designers')}
			</Typography>
			<Box
				mb={2}
				display='flex'
				flexDirection={{ xs: 'column', md: 'row' }}
				justifyContent='space-between'
			>
				<FormControl
					variant='filled'
					sx={{ marginBottom: { xs: 2, md: 0 }, minWidth: 200, }}
				>
					<InputLabel>{t('Sort by:')}</InputLabel>
					<Select
						value={localStatusFilter || ''}
						onChange={handleStatusFilterChange}
						label={t('Sort by:')}
						fullWidth
						sx={{
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
						<MenuItem value=''>{t('All')}</MenuItem>
						<MenuItem value='Free'>{t('Free')}</MenuItem>
						<MenuItem value='Busy'>{t('Busy')}</MenuItem>
						<MenuItem value='totalTasksCompleted'>
							{t('Most completed tasks')}
						</MenuItem>
						<MenuItem value='-totalTasksCompleted'>
							{t('Least completed tasks')}
						</MenuItem>
						<MenuItem value='inProgressTasks'>
							{t('Most in progress tasks')}
						</MenuItem>
						<MenuItem value='-inProgressTasks'>
							{t('Least in progress tasks')}
						</MenuItem>
					</Select>
				</FormControl>
				<FormControl variant='filled' sx={{ minWidth: 200 }}>
      <InputLabel >{t('Sort By')}</InputLabel>
      <Select
        value={sortBy}
        onChange={(e) => handleSortChange(e.target.value as string)}
        label={t('Sort By')}
        sx={{
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
        <MenuItem value='username'>{t('Name')}</MenuItem>
        <MenuItem value='-username'>{t('Name dec')}</MenuItem>
        <MenuItem value='email'>{t('Email')}</MenuItem>
        <MenuItem value='-email'>{t('Email dec')}</MenuItem>
      </Select>
    </FormControl>
			</Box>
			<Box display={{ xs: 'block', md: 'none' }} mt={2}>
        {filteredDesigners.map((designer: IDesigner) => (
          <Card key={designer.username} sx={{ backgroundColor: themeColors.cardBackground, border: `1px solid ${themeColors.secondary}`, marginBottom: 2 }}>
            <CardHeader
              title={designer.username}
              subheader={designer.email}
              avatar={<img src={designer.avatar} alt={designer.username} width={50} />}
              style={{ color: themeColors.text }}
            />
            <CardContent>
              <Typography variant="body2" style={{ color: themeColors.text }}>{t('Tasks Completed')}: {designer.totalTasksCompleted || 0}</Typography>
              <Typography variant="body2" style={{ color: themeColors.text }}>{t('Tasks In Progress')}: {designer.inProgressTasks}</Typography>
              <Typography variant="body2" style={{ color: themeColors.text }}>{designer.inProgressTasks === 0 ? t('Status') + ': ' + t('Free') : t('Status') + ': ' + t('Busy')}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
			<Box display={{ xs: 'none', md: 'block' }}>
				<TableContainer component={Paper} style={{ backgroundColor: themeColors.cardBackground, border: `1px solid ${themeColors.secondary}` }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell style={{ color: themeColors.text }} >{t('Avatar')}</TableCell>
								<TableCell style={{ color: themeColors.text }}>{t('Name')}</TableCell>
								<TableCell style={{ color: themeColors.text }}>{t('Email')}</TableCell>
								<TableCell style={{ color: themeColors.text }}>{t('Tasks Completed')}</TableCell>
								<TableCell style={{ color: themeColors.text }}>{t('Tasks In Progress')}</TableCell>
								<TableCell style={{ color: themeColors.text }}>{t('Status')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredDesigners.map((designer: IDesigner) => (
								<TableRow key={designer.username}>
									<TableCell>
										<img
											src={designer.avatar}
											alt={designer.username}
											width={50}
										/>
									</TableCell>
									<TableCell style={{ color: themeColors.text }}>{designer.username}</TableCell>
									<TableCell style={{ color: themeColors.text }}>{designer.email}</TableCell>
									<TableCell style={{ color: themeColors.text }}>{designer.totalTasksCompleted || 0}</TableCell>
									<TableCell style={{ color: themeColors.text }}>{designer.inProgressTasks}</TableCell>
									<TableCell style={{ color: themeColors.text }}>
										{designer.inProgressTasks === 0 ? t('Free') : t('Busy')}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Box display='flex' justifyContent='center' mt={2}>
				<Button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<span style={{ color: themeColors.text }}><ArrowBackIos /></span>
				</Button>
				{currentPage !== 1 && (
					<Button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<span style={{ color: themeColors.text }}>{currentPage - 1}</span>
					</Button>
				)}
				<Typography variant='body1' mx={2} color='Highlight'>
          <span style={{ color: themeColors.text }}>{currentPage}</span>
				</Typography>
				{currentPage !== 16 && (
					<Button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === 16}
					>
						<span style={{ color: themeColors.text }}>{currentPage + 1}</span>
					</Button>
				)}
				<Button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === 16}
				>
					<span style={{ color: themeColors.text }}><ArrowForwardIos /></span>
				</Button>
			</Box>
		</Box>
	)
}

export default DesignersTable
