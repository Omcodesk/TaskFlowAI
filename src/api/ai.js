import apiClient from './client';

export const breakdownTask = async (title) => {
    const { data } = await apiClient.post('/ai/breakdown', { title });
    return data;
};

export const summarizeTask = async (text) => {
    const { data } = await apiClient.post('/ai/summarize', { text });
    return data;
};

export const suggestPriority = async (title, description) => {
    const { data } = await apiClient.post('/ai/suggest-priority', { title, description });
    return data;
};

export const improveDescription = async (text) => {
    const { data } = await apiClient.post('/ai/improve-description', { text });
    return data;
};
