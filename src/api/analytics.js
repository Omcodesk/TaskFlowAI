import apiClient from './client';

export const fetchAnalyticsOverview = async () => {
    const { data } = await apiClient.get('/analytics/overview');
    return data;
};

export const fetchStatusDistribution = async () => {
    const { data } = await apiClient.get('/analytics/distribution');
    return data;
};

export const fetchProductivityTrend = async () => {
    const { data } = await apiClient.get('/analytics/trend');
    return data;
};

export const fetchEmployeeWorkload = async () => {
    const { data } = await apiClient.get('/analytics/workload');
    return data;
};
