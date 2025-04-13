// src/services/apiSlice.ts
const BASE_URL = 'https://enkyzxet9a.execute-api.us-east-2.amazonaws.com/staging/filesandfolders';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        fetchAllPosts: builder.query<any[], void>({
            query: () => `/posts${query}`,
            transformResponse: (response: any) => {
                try {
                    const parsed = JSON.parse(response?.body || response);
                    return parsed.data || parsed;
                } catch {
                    return response;
                }
            },
        }),
        fetchSubPosts: builder.query<any[], string>({
            query: (postId) => `/posts/subposts/${postId}`,
            transformResponse: (response: any) => {
                try {
                    let data = JSON.parse(response?.body || response);
                    const parsed = data?.subposts || [];
                    return parsed;
                } catch {
                    return response;
                }
            },
        }),
    }),
});

export const { useFetchAllPostsQuery, useLazyFetchSubPostsQuery } = apiSlice;
