import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { IDesigner } from '../../types';
import { API_URLS } from '../../serveces/apiConst'


export interface DesignerState {
  designers: IDesigner[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  total: number;
  page: number;
  sortBy: string;
}

const initialState: DesignerState = {
  designers: [],
  status: 'idle',
  error: null,
  total: 0,
  page: 1,
  sortBy: 'username',
};

export const fetchDesigners = createAsyncThunk<
  { results: IDesigner[], count: number },
  { page: number, sortBy: string },
  { state: RootState }
>('designers/fetchDesigners', async ({ page, sortBy }) => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('ordering', sortBy);

  const response = await axios.get<{ results: IDesigner[], count: number }>(`${API_URLS.designer}?${params.toString()}`);
  const designers = response.data.results;

  for (const designer of designers) {
    const issues = designer.issues;
    designer.totalTasksCompleted = issues.filter(issue => issue.status === 'Done').length;
    designer.inProgressTasks = issues.filter(issue => issue.status === 'In Progress').length;
  }

  return { results: designers, count: response.data.count };
});

const designersSlice = createSlice({
  name: 'designers',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesigners.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDesigners.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.designers = action.payload.results;
        state.total = action.payload.count;
      })
      .addCase(fetchDesigners.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch designers';
      });
  },
});

export const { setPage, setSortBy } = designersSlice.actions;
export const selectDesigners = (state: RootState) => state.designers.designers;
export const selectDesignersStatus = (state: RootState) => state.designers.status;
export const selectDesignersError = (state: RootState) => state.designers.error;
export const selectTotalDesigners = (state: RootState) => state.designers.total;
export const selectCurrentPage = (state: RootState) => state.designers.page;
export const selectSortBy = (state: RootState) => state.designers.sortBy;
export default designersSlice.reducer;
