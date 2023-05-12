import axios from "axios";
import { RefreshToken } from "./userAPI";

const host = process.env.REACT_APP_HOST;

const GetAllProducts = async () => {
    const path = '/product/get-all-products';
    const url = host + path;

    const response = await axios.get(url);
    const res = response.data;

    return res.metadata.products;
};

const GetProductById = async ({id}) => {
    const path = '/product/' + id;
    const url = host + path;

    const response = await axios.get(url);
    const res = response.data;

    return res.metadata.product;
};

const SearchProducts = async (key) => {
    const path = '/product/search';
    const url = host + path;

    const payload = {key: key};
    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const res = response.data;
    
        return res.metadata;
    } catch (error) {
        return error.response.data;
    }
};

const CreateProduct = async (fd) => {
    try {
        const path = '/product/create-product';
        const url = host + path;

        let token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }

        const response = await axios.post(url, fd, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
};

const UpdateProduct = async ({id, qty, price}) => {
    try {
        const path = `/product/update-product/${id}`;
        const url = host + path;

        let token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }

        const payload = {qty, price};
        const response = await axios.patch(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const res = response.data;
    
        return res;
    } catch (error) {
        return error.response.data;
    }
};

const DeleteProduct = async ({id}) => {
    try {
        const path = `/product/delete-product/${id}`;
        const url = host + path;

        let token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }

        const response = await axios.delete(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const res = response.data;
    
        return res;
    } catch (error) {
        return error.response.data;
    }
}

export { 
    GetAllProducts,
    GetProductById,
    SearchProducts,
    CreateProduct,
    UpdateProduct,
    DeleteProduct
}