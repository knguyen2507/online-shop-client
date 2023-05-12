import axios from "axios";
import { RefreshToken } from "./userAPI";

const host = process.env.REACT_APP_HOST;

const GetAllBrands = async () => {
    const path = '/brand/get-all-brands';
    const url = host + path;

    const response = await axios.get(url);
    const res = response.data;

    return res.metadata.brands;
}

const GetProductsByBrands = async ({brand}) => {
    const path = `/brand/${brand}/products`;
    const url = host + path;

    const response = await axios.get(url);
    const res = response.data;

    return res.metadata.products;
}

const GetBrandByName = async ({id}) => {
    const path = `/brand/${id}`;
    const url = host + path;

    const response = await axios.get(url);
    const res = response.data;

    return res.metadata.brand;
}

const CreateBrand = async (fd) => {
    try {
        const path = '/brand/create-brand';
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

const DeleteBrand = async ({id}) => {
    try {
        const path = `/brand/delete-brand/${id}`;
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
};

export { 
    GetAllBrands,
    GetProductsByBrands,
    GetBrandByName,
    CreateBrand,
    DeleteBrand
}