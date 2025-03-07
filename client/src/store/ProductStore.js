import { makeAutoObservable } from "mobx";

export default class ProductStore {
    constructor() {
        this._types = [
            {id: 1, name: 'рабочая одежда'},
            {id: 2, name: 'рабочая обувь'}
        ]
        this._brands = [
            {id: 1, name: 'adidas'},
            {id: 2, name: 'puma'}
        ]
        this._products = [
            {id: 1, name: 'adidas bsc', price: 564, rating: 5, img: 'https://cdn.4stand.com/huge/7f/9f/7f9fd06ebfd2d6d2e3986144983b320674a450f5.jpg'},
            {id: 2, name: 'adidas bsc', price: 564, rating: 5, img: 'https://cdn.4stand.com/huge/7f/9f/7f9fd06ebfd2d6d2e3986144983b320674a450f5.jpg'},
            {id: 3, name: 'adidas bsc', price: 564, rating: 5, img: 'https://cdn.4stand.com/huge/7f/9f/7f9fd06ebfd2d6d2e3986144983b320674a450f5.jpg'},
            {id: 4, name: 'adidas bsc', price: 564, rating: 5, img: 'https://cdn.4stand.com/huge/7f/9f/7f9fd06ebfd2d6d2e3986144983b320674a450f5.jpg'}

        ]
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types; 
    }
    setBrands(brands) {
        this._brands = brands; 
    }

    setProduct(products) {
        this._products = products; 
    }

    get types() {
        return this._types; 
    }
    get brands() {
        return this._brands; 
    }
    get products() {
        return this._products; 
    }
}

