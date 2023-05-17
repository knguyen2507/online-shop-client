import axios from "axios";
import Cookies from 'js-cookie';

const host = process.env.REACT_APP_HOST;

const GetAllUsers = async () => {
    try {
        const path = `/user/get-all-users`;
        const url = host + path;
        let token = localStorage.getItem('accessToken');
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
    
        return res.metadata;
    } catch (error) {
        return error.response.data;
    }
};

const GetUserById = async ({id}) => {
    try {
        const path = `/user/${id}`;
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
    
        return res.metadata;
    } catch (error) {
        return error.response.data;
    }
};

const GetUserByAdmin = async ({id}) => {
    try {
        const path = `/user/admin/get-user-by-id/${id}`;
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
    
        return res.metadata;
    } catch (error) {
        return error.response.data;
    }
};

const Login = async (username, password) => {
    const path = '/user/login';
    const url = host + path;

    const payload = {username: username, password: password};

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const res = response.data;
    
        return res.metadata;
    } catch (error) {
        return error.response.data;
    }
    
};

const LogOut = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
        return {code: 401, message: 'You need sign in'};
    }
    const path = '/user/logout';
    const url = host + path;

    const payload = {refreshToken: refreshToken};
    try {
        const response = await axios.delete(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: payload
        });
    
        return response.data;
    } catch (error) {
        return error.response.data
    }
};

const RefreshToken = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
        return {code: 401, message: 'you need sign in'};
    }
    const path = '/user/refresh-token';
    const url = host + path;

    const payload = {refreshToken: refreshToken};
    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        const res = response.data;
        
        return res;
    } catch (error) {
        return error.response.data
    }
};

const Register = async (username, password, email, name, re_password) => {
    const path = '/user/register';
    const url = host + path;

    const payload = {
        username: username, 
        password: password,
        email: email,
        name: name,
        re_password: re_password
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const res = response.data;
    
        return res.metadata;
    } catch (error) {
        return error.response.data;
    }  
};

const RegisterSendOtp = async (otp, username, password, email, name) => {
    const path = '/user/register/verify-otp';
    const url = host + path;

    const payload = {
        otp: otp,
        username: username, 
        password: password,
        email: email,
        name: name
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const res = response.data;
    
        return res.metadata;
    } catch (error) {
        return error.response.data;
    }
    
};

const CreateUserByAdmin = async ({name, username, password, re_password, email, role}) => {
    try {
        const path = `/user/admin/create-user`;
        const url = host + path;
        const token = localStorage.getItem('accessToken');
        if (!token) {
            const resp = await RefreshToken();
            token = resp.accessToken;
            localStorage.setItem('accessToken', token);
        }
        const payload = {name, username, password, re_password, email, role};

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
};

const DeleteUser = async ({id}) => {
    try {
        const path = `/user/admin/delete-user/${id}`;
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
    GetAllUsers,
    GetUserById,
    GetUserByAdmin,
    Login,
    LogOut,
    RefreshToken,
    Register,
    RegisterSendOtp,
    CreateUserByAdmin,
    DeleteUser
}