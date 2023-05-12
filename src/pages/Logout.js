import Navigation from "../components/Navigation.js";
import Title from "../components/Title.js";
import Footer from "../components/Footer.js";
import Container from 'react-bootstrap/Container';
import { LogOut } from "../services/userAPI.js";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

const title = "Logout";

function Logout () {
    document.title = title.toUpperCase();

    const [msg, setMsg] = useState('');
    
    useEffect(() => {
        const logout = async () => {
            const res = await LogOut();
            if (res.code >= 400) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('idUser');
                localStorage.removeItem('nameUser');
                localStorage.removeItem('role');
                Cookies.remove('refreshToken');
            }
            if (res.code < 400) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('idUser');
                localStorage.removeItem('nameUser');
                localStorage.removeItem('role');
                Cookies.remove('refreshToken');
            }
            setMsg(res.message);
        }
        logout();
    }, []) 

    return (
        <>
            <Navigation />
            <Title title={title} />
            <Container>
                {msg}
            </Container>
            <Footer />
        </>
    )
}

export default Logout;