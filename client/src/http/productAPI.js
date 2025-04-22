import { $authHost } from './index';

export const createProduct = async (formData) => {
    const { data } = await $authHost.post('/api/product', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
};

export const fetchProducts = async (categoryId, page, limit = 5) => {
    const { data } = await $authHost.get('/api/product', {
        params: {
            categoryId, page, limit
        }
    });
    return data;
};

export const fetchOneProduct = async (id) => {
    const { data } = await $authHost.get('/api/product/' + id);
    return data;
}; 