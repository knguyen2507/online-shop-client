import Navigation from "../components/Navigation.js";
import Footer from "../components/Footer.js";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useParams } from "react-router-dom";
import { 
    GetUserById,
    RefreshToken 
} from '../services/userAPI.js';
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

const title = "User Information";

function User () {
    document.title = title.toUpperCase();

    const {id} = useParams();
    const [info, setInfo] = useState([]);
    const [errStatus, setErrStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const userInfo = async ({id}) => {
            const res = await GetUserById({id});

            if (res.code >= 400 && res.message !== 'jwt expired') {
                setErrStatus(true);
                setErrorMsg(res.message);
            }
            else if (res.code === 401 && res.message === 'jwt expired') {
                const res = await RefreshToken();
                if (res.code >= 400) {
                    setErrorMsg(res.message);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('idUser');
                    localStorage.removeItem('nameUser');
                    localStorage.removeItem('role');
                    Cookies.remove('refreshToken');
                } else {
                    const accessToken = res.accessToken;
                    localStorage.setItem('accessToken', accessToken);
                    const response = await GetUserById({id});
                    setInfo(response.user);
                }
            } else {
                setInfo(res.user);
            }
        };
        userInfo({id});
    }, [])

    if (errStatus) {
        return (
            <p>{errorMsg}</p>
        )
    }

    return (
        <>
            <Navigation />
            <Container>
                <Row style={{marginTop: "25px", marginBottom: "25px"}}>
                    {<p>{info.name}</p>}
                </Row>
            </Container>
            <Footer />
        </>
    )
}

export default User;