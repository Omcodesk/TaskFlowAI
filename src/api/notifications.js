import apiClient from './client';

export const fetchNotifications = async () => {
    const { data } = await apiClient.get('/notifications');
    return data;
};

export const markNotificationAsRead = async (id) => {
    const { data } = await apiClient.put(`/notifications/${id}/read`);
    return data;
};
