// src/features/posts/postsSelectors.ts
import { RootState } from '../../app/store';

export const selectVisiblePosts = (state: RootState) => state.posts.visiblePosts;
export const selectHasMore = (state: RootState) => state.posts.hasMore;
export const selectOffset = (state: RootState) => state.posts.offset;
