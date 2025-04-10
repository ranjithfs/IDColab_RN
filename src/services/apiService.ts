
// 🗂️ File: services/apiService.ts
const BASE_URL = 'https://enkyzxet9a.execute-api.us-east-2.amazonaws.com/staging/filesandfolders';
const CLOUDFRONT_URL = 'https://d1re9w76jc5b65.cloudfront.net';

export const fetchPosts = async () => {
  try {
    const projectIds = [
      '33c14d72-8d22-45cd-a9ee-1c766182c393',
      '3989bb4f-5281-4441-a426-95771f024177',
      'd028b9a0-97fe-11ec-95fa-990b89da28fb',
      'fd7eef5e-0f8f-421e-acb0-6b556e62ed34',
      'aa393e39-6bbc-40ff-95fe-8782968dc3fa',
      '7b12ef64-efbb-417e-9f2d-19992f92933a',
      'c5e4c6d9-deab-41ca-89dc-68dc0e54dfed',
      '538201a8-ddff-4e87-9b94-f3d1f5ffb512',
    ];

    const query = `?isBlocker=false&projectId=${projectIds.join(',')}`;
    const response = await fetch(`${BASE_URL}/posts${query}`);
    const json = await response.json();
    return json?.body || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const fetchSubPosts = async (postId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/subposts/${postId}`);
    const json = await response.json();
    return json?.body || [];
  } catch (error) {
    console.error(`Error fetching subposts for ${postId}:`, error);
    return [];
  }
};

export const getCloudFrontUrl = (fileS3Id: string) => `${CLOUDFRONT_URL}/${fileS3Id}`;