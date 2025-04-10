import React from 'react';
import ImagePostCard from './cards/ImagePostCard';
import VideoPostCard from './cards/VideoPostCard';
import DefaultPostCard from './cards/DefaultPostCard';

const PostCardFactory = ({ post }: any) => {
  switch (post.category) {
    case 'images':
    case 'panorama':
    case 'files':
    case 'renderings':
    case 'sidebyside':
      return <ImagePostCard post={post} />;
    case 'videos':
      return <VideoPostCard post={post} />;
    default:
      return <DefaultPostCard post={post} />;
  }
};

export default PostCardFactory;