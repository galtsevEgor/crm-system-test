import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { IDesigner, IDesignIssue } from '../../types';
import { API_URLS } from '../../serveces/apiConst'

export interface MainPageState {
  topDesigners: IDesigner[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  sortBy: 'medianTime' | 'totalTasksCompleted';
}

const initialState: MainPageState = {
  topDesigners: [],
  status: 'idle',
  error: null,
  sortBy: 'medianTime',
};

export const fetchTopDesigners = createAsyncThunk<
  { results: IDesigner[] },
  string,
  { state: RootState }
>('mainPage/fetchTopDesigners', async (queryKey) => {
  try {
    const designersResponse = await axios.get(`${API_URLS.designer}${queryKey}`);
    const designers: IDesigner[] = designersResponse.data.results;
    const results: IDesigner[] = [];
    for (const designer of designers) {
    const designerWithDetails: IDesigner = {
      ...designer,
      medianTime: calculateMedianTime(designer.issues.filter(issue => issue.status === 'Done')),
      totalTasksCompleted: designer.issues.filter(issue => issue.status === 'Done').length,
      inProgressTasks: designer.issues.filter(issue => issue.status === 'In Progress').length,
    };
    console.log(designerWithDetails);
    
    results.push(designerWithDetails)
  }
    return { results };
  } catch (error) {
    throw new Error('Failed to fetch designer data');
  }
});

const calculateMedianTime = (issues: IDesignIssue[]): number => {
  const sortedTimes = issues.map(issue => calculateTaskTime(issue)).sort((a, b) => a - b);
  const length = sortedTimes.length;
  if (length === 0) {
    return 0;
  }
  const mid = Math.floor(length / 2);
  if (length % 2 === 0) {
    return (sortedTimes[mid - 1] + sortedTimes[mid]) / 2;
  }
  return sortedTimes[mid];
};

const calculateTaskTime = (issue: IDesignIssue): number => {
  const startDate = new Date(issue.date_started_by_designer as string);
  const endDate = new Date(issue.date_finished_by_designer as string);
  const timeDiff = endDate.getTime() - startDate.getTime();
  console.log(Math.abs(timeDiff / (1000 * 60 * 60)))
  return Math.abs(timeDiff / (1000 * 60 * 60));
};
const mainPageSlice = createSlice({
  name: 'mainPage',
  initialState,
  reducers: {
    sortByMedianTime(state) {
      state.sortBy = 'medianTime';
      state.topDesigners.sort((a, b) => {
        const medianTimeA = a.medianTime !== undefined ? a.medianTime : Infinity;
        const medianTimeB = b.medianTime !== undefined ? b.medianTime : Infinity;
        return medianTimeA - medianTimeB;
      });
    },
    sortByTotalTasksCompleted(state) {
      state.sortBy = 'totalTasksCompleted';
      state.topDesigners.sort((a, b) => {
        const totalTasksA = a.totalTasksCompleted !== undefined ? a.totalTasksCompleted : 0;
        const totalTasksB = b.totalTasksCompleted !== undefined ? b.totalTasksCompleted : 0;
        return totalTasksB - totalTasksA;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopDesigners.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopDesigners.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topDesigners = action.payload.results;

        if (state.sortBy === 'medianTime') {
          state.topDesigners.sort((a, b) => {
            const medianTimeA = a.medianTime !== undefined ? a.medianTime : Infinity;
            const medianTimeB = b.medianTime !== undefined ? b.medianTime : Infinity;
            return medianTimeA - medianTimeB;
          });
        } else if (state.sortBy === 'totalTasksCompleted') {
          state.topDesigners.sort((a, b) => {
            const totalTasksA = a.totalTasksCompleted !== undefined ? a.totalTasksCompleted : 0;
            const totalTasksB = b.totalTasksCompleted !== undefined ? b.totalTasksCompleted : 0;
            return totalTasksB - totalTasksA;
          });
        }
      })
      .addCase(fetchTopDesigners.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch top designers';
      });
  },
});


export const { sortByMedianTime, sortByTotalTasksCompleted } = mainPageSlice.actions;
export const selectTopDesigners = (state: RootState) => state.mainPage.topDesigners;
export const selectMainPageStatus = (state: RootState) => state.mainPage.status;
export const selectMainPageError = (state: RootState) => state.mainPage.error;

export default mainPageSlice.reducer;




