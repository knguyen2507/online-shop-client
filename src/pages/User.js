import Navigation from "../components/Navigation.js";
import Footer from "../components/Footer.js";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useParams } from "react-router-dom";
import { 
    GetUserById,
    RefreshToken,
    ChangePassword 
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
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [changePwd, setChangePwd] = useState(false);
    const [status, setStatus] = useState(false);
    const [modalErrStatus, setModalErrStatus] = useState(false);
    const [modalErrorMsg, setModalErrorMsg] = useState('');


    const ShowModal = () => {
        setChangePwd(true)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await ChangePassword(id, currentPassword, password, repeatPassword);

        if (res.code >= 400 && res.message !== 'jwt expired') {
            setModalErrStatus(true);
            setModalErrorMsg(res.message);
        } else if (res.code >= 400 && res.message === 'jwt expired') {
            const response = await RefreshToken();
            if (response.code >= 400) {
                alert(response.message);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('idUser');
                localStorage.removeItem('nameUser');
                localStorage.removeItem('role');
                Cookies.remove('refreshToken');
                window.location.href = '/';
            } else {
                const accessToken = response.accessToken;
                localStorage.setItem('accessToken', accessToken);
                await ChangePassword(id, currentPassword, password, repeatPassword);
                setModalErrStatus(false);
                setModalErrorMsg('');
                setStatus(true);
            }
        } else {
            setModalErrStatus(false);
            setModalErrorMsg('');
            setStatus(true);
        }
    };

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
    }, []);

    const div = {
        margin: "auto",
        borderRadius: "5px",
        backgroundColor: "#f2f2f2",
        padding: "20px",
        width: "400px",
        marginBottom: "20px"
    }

    const input = {
        width: "300px",
        height: "40px",
        display: "block",
        margin: "auto",
        marginBottom: "10px"
    };

    const button = {
        width: "140px",
        height: "40px",
        display: "block",
        margin: "auto",
        backgroundColor: "MediumSeaGreen",
        border: "1px solid white",
        borderRadius: "5px"
    }

    function ErrorMessage ({msg}) {
        const errDiv = {
            margin: "auto",
            borderRadius: "5px",
            backgroundColor: "crimson",
            padding: "20px",
            width: "300px",
            height: "60px",
            marginBottom: "20px"
        }

        const err = {
            textAlign: "center",
            margin: "auto",
            color: "white",
            fontSize: "15px"
        };

        return (
            <div style={errDiv}>
                <p style={err}>{msg}</p>
            </div>
        )
    }

    function SuccessMessage () {
        const successDiv = {
            margin: "auto",
            borderRadius: "5px",
            backgroundColor: "#14A44D",
            padding: "20px",
            width: "300px",
            height: "80px",
            marginBottom: "20px"
        }

        const success = {
            textAlign: "center",
            margin: "auto",
            color: "white",
            fontSize: "15px"
        };

        return (
            <div style={successDiv}>
                <p style={success}>Change password successfully</p>
            </div>
        )
    }

    if (errStatus) {
        return (
            <p>{errorMsg}</p>
        )
    }

    return (
        <>
            <Navigation />
            <Container>
            <Modal show={changePwd} onHide={() => {
                setChangePwd(false)
                setErrStatus(false)
                setStatus(false)
            }}>
                    <Modal.Header closeButton>
                        <Modal.Title>NEW PASSWORD</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={div}>
                            <form onSubmit={handleSubmit}>
                                <input 
                                    style={input} 
                                    type="password" 
                                    id="currentPassword"
                                    name="currentPassword" 
                                    placeholder="Current Password"
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    value={currentPassword}
                                />
                                <input 
                                    style={input} 
                                    type="password" 
                                    id="password"
                                    name="password" 
                                    placeholder="New Password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                />
                                <input 
                                    style={input} 
                                    type="password" 
                                    id="re-password"
                                    name="re-password" 
                                    placeholder="Repeat Password"
                                    onChange={e => setRepeatPassword(e.target.value)}
                                    value={repeatPassword}
                                />
                                <input style={button} type="submit" value="Change Password" />
                            </form>
                        </div>
                        {modalErrStatus ? ErrorMessage({msg: modalErrorMsg}) : (status ? SuccessMessage() : true)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => {
                            setChangePwd(false)
                            setErrStatus(false)
                            setStatus(false)
                        }}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Row style={{marginTop: "25px", marginBottom: "25px"}}>
                    {<p>{info.name}</p>}
                    <p onClick={ShowModal} style={{color:"blue"}}><a>Change Password</a></p>
                </Row>
            </Container>
            <Footer />
        </>
    )
}

export default User;