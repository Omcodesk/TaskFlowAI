import apiClient from './client';

export const fetchTasks = async () => {
    const { data } = await apiClient.get('/tasks');
    return data;
};

export const createTask = async (taskData) => {
    const { data } = await apiClient.post('/tasks', taskData);
    return data;
};

export const updateTaskStatus = async ({ taskId, status }) => {
    const { data } = await apiClient.put(`/tasks/${taskId}/status`, { status });
    return data;
};

export const updateTaskDetails = async ({ taskId, taskData }) => {
    const { data } = await apiClient.put(`/tasks/${taskId}`, taskData);
    return data;
};

export const uploadAttachment = async ({ taskId, file }) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await apiClient.post(`/tasks/${taskId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};
