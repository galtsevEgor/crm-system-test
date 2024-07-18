import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { IComment, IProject } from '../../types';
import { API_URLS } from '../../serveces/apiConst';

export interface CommentsState {
  comments: IComment[];
  projects: IProject[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CommentsState = {
  projects: [],
  comments: [],
  status: 'idle',
  error: null,
};

export const fetchProject = createAsyncThunk<IProject[], undefined , {state: RootState}>(
  'commets/fetchProject',
  async () => {
    const projectResponse = await axios.get<IProject[]>(`${API_URLS.project}`);
    return projectResponse.data
  }
)

export const fetchComments = createAsyncThunk<IComment[], string, { state: RootState }>(
  'comments/fetchComments',
  async (query, { dispatch }) => {
    const projectsResult = await dispatch(fetchProject()).unwrap();
    const projects = projectsResult;
    const response = await axios.get<IComment[]>(`${API_URLS.comment}${query}`);
    const comments = response.data;

    const updatedComments = comments.map(com => {
      const project = projects.find(proj => proj.key === com.issue.split('-')[0]);
      return project ? { ...com, issue: project.name } : com;
    });
    return updatedComments;
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder
      .addCase(fetchComments.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Ошибка загрузки комментариев';
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
  },
});

export const selectComments = (state: RootState) => state.comments.comments;
export const selectCommentsStatus = (state: RootState) => state.comments.status;
export const selectCommentsError = (state: RootState) => state.comments.error;

export default commentsSlice.reducer;
