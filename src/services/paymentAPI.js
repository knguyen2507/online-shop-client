import axios from "axios";
import { RefreshToken } from "./userAPI.js";

const host = process.env.REACT_APP_HOST;

const GetAllPayments = async () => {
    try {
        const path = `/payment/admin/get-all-payments`;
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

const GetAllHistoryPayments = async () => {
    try {
        const path = `/payment/admin/history`;
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

const GetPaymentById = async ({id}) => {
    try {
        const path = `/payment/${id}`;
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

const GetPaymentsByIdUser = async ({id}) => {
    try {
        const path = `/payment/user/${id}/get-payments-by-id`;
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

const GetHistoryPaymentsByIdUser = async ({id}) => {
    try {
        const path = `/payment/user/${id}/get-history-payments-by-id`;
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

const PaymentCart = async ({id, carts}) => {
    try {
        const path = `/payment/user/${id}/send-payment`;
        const url = host + path;
        const token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }
        const payload = {carts};
    
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

const CancelPayment = async ({id}) => {
    try {
        const path = `/payment/user/${id}/cancel-payment`;
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

const CancelPaymentByAdmin = async ({id}) => {
    try {
        const path = `/payment/admin/${id}/cancel-payment`;
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

const ConfirmPayment = async ({id}) => {
    try {
        const path = `/payment/admin/${id}/confirm-payment`;
        const url = host + path;
        const token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }
    
        const response = await axios.post(url, {}, {
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
    GetAllPayments,
    GetAllHistoryPayments,
    GetPaymentById,
    GetPaymentsByIdUser,
    GetHistoryPaymentsByIdUser,
    PaymentCart,
    CancelPayment,
    CancelPaymentByAdmin,
    ConfirmPayment
};