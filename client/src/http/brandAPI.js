import { $authHost } from './index';

export const fetchBrands = async () => {
    const { data } = await $authHost.get('/api/brand');
    return data;
};

export const createBrand = async (name) => {
    const { data } = await $authHost.post('/api/brand', { name });
    return data;
}; 