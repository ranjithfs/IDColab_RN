import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { fetchPosts, fetchSubPosts, getCloudFrontUrl } from '../services/apiService';
import PostCardFactory from '../components/PostCardFactory';

const BATCH_SIZE = 3;

const HomeScreen = () => {
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Initial load
  useEffect(() => {
    const loadInitialPosts = async () => {
      const posts = await fetchPosts();
      let parsed = [];

      try {
        parsed = JSON.parse(posts)?.data || posts;
      } catch (err) {
        parsed = posts;
      }

      setAllPosts(parsed);
      await loadMorePosts(parsed, 0); // First batch
      setLoading(false);
    };

    loadInitialPosts();
  }, []);

  // Load 3 more posts
  const loadMorePosts = async (posts: any[], currentOffset: number) => {
    if (isFetchingMore || currentOffset >= posts.length) return;

    setIsFetchingMore(true);
    const nextBatch = posts.slice(currentOffset, currentOffset + BATCH_SIZE);

    const enriched = await Promise.all(
      nextBatch.map(async (post) => {
        const subposts = await fetchSubPosts(post.postId);
        let parsed = [];
        try {
          parsed = JSON.parse(subposts)?.subposts || subposts;
        } catch (err) {
          parsed = subposts;
        }

        return {
          ...post,
          subposts: parsed.map((sp: any) => ({
            ...sp,
            imageUrl: getCloudFrontUrl(sp.fileS3Id) || '',
          })),
        };
      })
    );

    console.log(enriched);


    setVisiblePosts((prev) => [...prev, ...enriched]);
    setOffset(currentOffset + BATCH_SIZE);
    setIsFetchingMore(false);
  };

  const handleEndReached = () => {
    if (!isFetchingMore && offset < allPosts.length) {
      loadMorePosts(allPosts, offset);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: '#facc15' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          style={{ backgroundColor: 'transparent' }}
          data={visiblePosts}
          keyExtractor={(item, index) => `${item.postId}-${index}`}
          renderItem={({ item }) => <PostCardFactory post={item} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1} // Load more only when truly near end
          ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#888" /> : null}
        />
      )}
    </View>
  );
};

export default HomeScreen;
