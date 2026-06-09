import apiClient from './client';

export const fetchUsers = async () => {
    const { data } = await apiClient.get('/users');
    return data;
};

export const fetchPendingUsers = async () => {
    const { data } = await apiClient.get('/users/pending');
    return data;
};

export const approveUser = async (userId) => {
    const { data } = await apiClient.put(`/users/${userId}/approve`);
    return data;
};

export const rejectUser = async (userId) => {
    const { data } = await apiClient.delete(`/users/${userId}/reject`);
    return data;
};
