import apiClient from './client';

export const fetchProjects = async () => {
    const { data } = await apiClient.get('/projects');
    return data;
};

export const createProject = async (projectData) => {
    const { data } = await apiClient.post('/projects', projectData);
    return data;
};

export const updateProject = async ({ id, ...projectData }) => {
    const { data } = await apiClient.put(`/projects/${id}`, projectData);
    return data;
};

export const deleteProject = async (id) => {
    const { data } = await apiClient.delete(`/projects/${id}`);
    return data;
};
