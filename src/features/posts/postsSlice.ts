// src/features/posts/postsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostsState {
  allPosts: any[];
  visiblePosts: any[];
  offset: number;
  hasMore: boolean;
  batchSize: number;
}

const initialState: PostsState = {
  allPosts: [],
  visiblePosts: [],
  offset: 0,
  hasMore: true,
  batchSize: 3,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setAllPosts: (state, action: PayloadAction<any[]>) => {
      state.allPosts = action.payload;
      state.visiblePosts = [];
      state.offset = 0;
      state.hasMore = true;
    },
    appendNextBatch: (state) => {
      const nextBatch = state.allPosts.slice(state.offset, state.offset + state.batchSize);
      state.visiblePosts.push(...nextBatch);
      state.offset += state.batchSize;
      if (state.offset >= state.allPosts.length) {
        state.hasMore = false;
      }
    },
    enrichVisiblePost: (state, action: PayloadAction<{ postId: string; subposts: any[] }>) => {
      const { postId, subposts } = action.payload;
      const index = state.visiblePosts.findIndex((p) => p.postId === postId);
      if (index !== -1) {
        state.visiblePosts[index].subposts = subposts;
      }
    },
  },
});

export const { setAllPosts, appendNextBatch, enrichVisiblePost } = postsSlice.actions;
export default postsSlice.reducer;
