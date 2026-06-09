import apiClient from './client';

export const fetchActivities = async () => {
    const { data } = await apiClient.get('/activities');
    return data;
};
