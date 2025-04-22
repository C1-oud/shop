import { $authHost } from './index';

export const addToBasket = async (productId, quantity = 1) => {
    const { data } = await $authHost.post('api/basket/add', { productId, quantity });
    return data;
};

export const getBasket = async () => {
    const { data } = await $authHost.get('api/basket');
    return data;
};

export const updateBasketItem = async (productId, quantity) => {
    const { data } = await $authHost.put('api/basket/update', { productId, quantity });
    return data;
};

export const removeFromBasket = async (productId) => {
    const { data } = await $authHost.delete(`api/basket/${productId}`);
    return data;
}; 