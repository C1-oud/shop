import { $authHost } from './index';

export const fetchCategories = async () => {
    const { data } = await $authHost.get('/api/category');
    return data;
};

export const createCategory = async (name) => {
    const { data } = await $authHost.post('/api/category', { name });
    return data;
}; 