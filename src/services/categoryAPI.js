import axios from "axios";
import { RefreshToken } from "./userAPI";

const host = process.env.REACT_APP_HOST;

const GetAllCategories = async () => {
    const path = '/category/get-all-categories';
    const url = host + path;

    const response = await axios.get(url);
    const res = response.data;

    return res.metadata.categories;
}

const GetProductsByCategories = async ({category}) => {
    const path = `/category/${category}/products`;
    const url = host + path;

    const response = await axios.get(url);
    const res = response.data;

    return res.metadata.products;
}

const GetCategoryById = async ({id}) => {
    const path = `/category/${id}`;
    const url = host + path;

    const response = await axios.get(url);
    const res = response.data;

    return res.metadata.category;
};

const CreateCategory = async ({id, name}) => {
    try {
        const path = '/category/create-category';
        const url = host + path;
        const payload = {id, name};

        let token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
};

const DeleteCategory = async ({id}) => {
    try {
        const path = `/category/delete-category/${id}`;
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
    GetAllCategories,
    GetProductsByCategories,
    GetCategoryById,
    CreateCategory,
    DeleteCategory
}