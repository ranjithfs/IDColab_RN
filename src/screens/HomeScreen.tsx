// src/screens/HomeScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import {
  useFetchAllPostsQuery,
  useLazyFetchSubPostsQuery,
} from '../services/apiSlice';
import {
  setAllPosts,
  appendNextBatch,
  enrichVisiblePost,
} from '../features/posts/postsSlice';
import {
  selectVisiblePosts,
  selectHasMore,
} from '../features/posts/postsSelectors';
import { getCloudFrontUrl } from '../services/apiService';
import PostCardFactory from '../components/PostCardFactory';
import { useAppDispatch, useAppSelector } from '../hook';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const visiblePosts = useAppSelector(selectVisiblePosts);
  const hasMore = useAppSelector(selectHasMore);
  const { data: allPosts = [], isLoading } = useFetchAllPostsQuery();
  const [fetchSubPosts] = useLazyFetchSubPostsQuery();

  useEffect(() => {
    if (allPosts.length > 0) {
      dispatch(setAllPosts(allPosts));
      dispatch(appendNextBatch());
    }
  }, [allPosts]);

  const loadMore = () => {
    if (hasMore) {
      dispatch(appendNextBatch());
    }
  };

  const handleViewableItemsChanged = async ({ changed }: any) => {
    for (const item of changed) {
      const post = item.item;
      if (!post.subposts) {
        const sub = await fetchSubPosts(post.postId).unwrap();
        dispatch(enrichVisiblePost({
          postId: post.postId,
          subposts: sub.map((sp: any) => ({
            ...sp,
            imageUrl: getCloudFrontUrl(sp.fileS3Id),
          })),
        }));
      }
    }
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: '#facc15', justifyContent: isLoading ? 'center' : 'flex-start' }}>
      {isLoading ? (
        <ActivityIndicator size={30} color="#000" />
      ) : (
        <FlatList
          data={visiblePosts}
          keyExtractor={(item, index) => `${item.postId}-${index}`}
          renderItem={({ item }) => <PostCardFactory post={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={hasMore ? <ActivityIndicator size="small" color="#888" /> : null}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
      )}
    </View>
  );
};

export default HomeScreen;
