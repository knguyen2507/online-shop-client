import axios from "axios";
import { RefreshToken } from "./userAPI.js";

const host = process.env.REACT_APP_HOST;

const GetCartById = async ({id}) => {
    try {
        const path = `/cart/${id}`;
        const url = host + path;
        const token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }
    
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const res = response.data;
    
        return res;
    } catch (error) {
        return error.response.data;
    }
};

const AddProductToCart = async ({idProduct}) => {
    try {
        const path = `/cart/add-product-to-cart`;
        const url = host + path;
        const token = localStorage.getItem('accessToken');
        const payload = {
            id: idProduct
        };
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }
    
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const res = response.data;
    
        return res;
    } catch (error) {
        return error.response.data;
    }
};

const AddQtyProductInCart = async ({id}) => {
    try {
        const path = `/cart/${id}/add-qty-product-from-cart`;
        const url = host + path;
        const token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }
    
        const response = await axios.patch(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const res = response.data;
    
        return res;
    } catch (error) {
        return error.response.data;
    }
};

const ReduceQtyProductInCart = async ({id}) => {
    try {
        const path = `/cart/${id}/reduce-product-from-cart`;
        const url = host + path;
        const token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }
    
        const response = await axios.patch(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const res = response.data;
    
        return res;
    } catch (error) {
        return error.response.data;
    }
};

const RemoveProductInCart = async ({id}) => {
    try {
        const path = `/cart/${id}/remove-product-from-cart`;
        const url = host + path;
        const token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }
    
        const response = await axios.delete(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const res = response.data;
    
        return res;
    } catch (error) {
        return error.response.data;
    }
};

export {
    GetCartById,
    AddProductToCart,
    AddQtyProductInCart,
    ReduceQtyProductInCart,
    RemoveProductInCart
}

