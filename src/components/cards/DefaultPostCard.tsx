import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';
import FullViewModal from './FullViewModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const width = Dimensions.get('window').width;

const SubPostCarousel = ({ subposts, onFullView, post }: { subposts: any[]; onFullView: () => void, post: any }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onViewRef = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View>
      <FlatList
        data={subposts}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.fileS3Id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <View style={styles.centered}>
              <Text>{post.category?.toUpperCase() || 'UNKNOWN CATEGORY'}</Text>
              <Text style={styles.description}>{item.fileName}</Text></View>
          </View>
        )
        }
        ListEmptyComponent={
          <View style={styles.imageWrapper}>
            < View style={styles.centered} >
              <Text>{post.category?.toUpperCase() || 'UNKNOWN CATEGORY'}</Text>
            </View >
          </View>
        }
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
      {/* Dots Indicator */}
      < View style={styles.dotsContainer} >
        {
          subposts.length > 1 &&
          subposts.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, activeIndex === index ? styles.dotActive : styles.dotInactive]}
            />
          ))
        }
      </View >

      {/* Full View Icon */}
      < TouchableOpacity style={styles.fullViewIcon} onPress={onFullView} >
        <MaterialCommunityIcons name="fullscreen-exit" size={24} color="#333" />
      </TouchableOpacity >
    </View >
  );
};

const DefaultPostCard = ({ post }: any) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.meta}>{moment(post.createdAt).fromNow()}</Text>
      <SubPostCarousel subposts={post.subposts || []} post={post} onFullView={() => setModalVisible(true)} />
      <Text style={styles.description}>{post.postDescription}</Text>
      <Text style={styles.tags}>Tagged: {post.taggedEmails?.join(', ')}</Text>

      <FullViewModal visible={modalVisible} onClose={() => setModalVisible(false)} subposts={post.subposts} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
  },
  meta: {
    fontSize: 12,
    color: '#999',
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageWrapper: {
    width: width - (width * 0.1),
    height: 200,
    justifyContent: 'center',
    padding: width * 0.03,
    alignItems: 'center',
    borderRadius: 12,
  },
  centered: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  description: {
    fontWeight: '500',
    marginTop: 5,
  },
  tags: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#333',
  },
  dotInactive: {
    backgroundColor: '#ccc',
  },
  fullViewIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 5,
    elevation: 3,
  },
});

export default DefaultPostCard;