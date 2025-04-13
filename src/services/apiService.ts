const CLOUDFRONT_URL = 'https://d1re9w76jc5b65.cloudfront.net';

export const getCloudFrontUrl = (fileS3Id: string) => `${CLOUDFRONT_URL}/${fileS3Id}`;