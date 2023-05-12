import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import {
    CreateUserByAdmin,
    DeleteUser,
    RefreshToken
} from '../../services/userAPI.js';

function User(props) {
    const users = props.users;
    let userNumberPages = 0;
    const [key, setKey] = useState('');
    const [page, setPage] = useState(1);
    const [paginatedItems, setPaginatedItems] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [errStatus, setErrStatus] = useState(false);
    const [createStatus, setCreateStatus] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [warningId, setWarningId] = useState('');
    const [showView, setShowView] = useState(false);
    const [userView, setUserView] = useState({});

    if (users.length%4 === 0) {
        userNumberPages = Math.floor(users.length/4);
    } else {
        userNumberPages = Math.floor(users.length/4) + 1;
    }

    function searchBtn() {
        if (key !== '') {
            return true
        }
    };

    useEffect(() => {
        const itemPage = ({item, page}) => {
            let items = [];
            if (page === userNumberPages) {
                for (let i=4*(page-1); i < item.length; i++) {
                    items.push(item[i]);
                }
            } else {
                for (let i=4*(page-1); i < 4*page; i++) {
                    items.push(item[i]);
                }
            }
            return items;
        };

        function PaginatedItems (properties) {
            const users = itemPage({item: properties.users, page});
            return (
                <>
                    {users.map(user => (
                        <Row style={{borderBottom: "solid 2px"}}>
                            <Col xs={3} md={2}>{user.name}</Col>
                            <Col xs={6} md={4}>{user.email}</Col>
                            <Col xs={3} md={2}>{user.username}</Col>
                            <Col xs={3} md={2}>
                                {
                                    user.role === 'Admin' ? <p style={{fontWeight: "bold"}}>{user.role}</p> : <p>{user.role}</p>
                                }
                            </Col>
                            <Col xs={3} md={2}>
                                <Button 
                                    variant="info"
                                    style={{
                                        fontSize: "10px",
                                        height: "50px",
                                        width: "130px"
                                    }}
                                    onClick={() => {
                                        setShowView(true)
                                        setUserView(user)
                                    }}
                                >View</Button>
                                <Button 
                                    variant="danger"
                                    style={{
                                        fontSize: "10px",
                                        height: "50px",
                                        width: "130px"
                                    }}
                                    onClick={() => {
                                        setShowWarning(true)
                                        setWarningId(user._id)
                                    }}
                                >Delete</Button>
                            </Col>
                        </Row>
                    ))}
                </>
            )
        }
        setPaginatedItems(<PaginatedItems users={props.users} />);
    }, [page])

    const div = {
        margin: "auto",
        borderRadius: "5px",
        backgroundColor: "#f2f2f2",
        padding: "20px",
        width: "400px",
        marginBottom: "20px"
    };

    const input = {
        width: "300px",
        height: "40px",
        display: "block",
        margin: "auto",
        marginBottom: "10px"
    };

    const inputView = {
        width: "100%",
        height: "40px",
        display: "block",
        margin: "auto",
        marginBottom: "10px"
    };

    const button = {
        width: "130px",
        height: "40px",
        display: "block",
        margin: "auto",
        backgroundColor: "MediumSeaGreen",
        border: "1px solid white",
        borderRadius: "5px"
    };

    function ErrorMessage () {
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
                <p style={err}>{errMsg}</p>
            </div>
        )
    };

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
                <p style={success}>Product has been successfully created</p>
            </div>
        )
    }

    const handleDelete = async () => {
        const res = await DeleteUser({id: warningId});
        if (res.code >= 400 && res.message !== 'jwt expired') {
            alert(res.message);
        } else if (res.code >= 400 && res.message === 'jwt expired') {
            const response = await RefreshToken();
            if (response.code >= 400) {
                alert(response.message);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('idUser');
                localStorage.removeItem('nameUser');
                localStorage.removeItem('role');
                Cookies.remove('refreshToken');
            } else {
                const accessToken = response.accessToken;
                localStorage.setItem('accessToken', accessToken);
            }
        } else {
            alert(res.message);
            window.location.reload(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (role === '0') {
            setErrStatus(true);
            setCreateStatus(false);
            setErrMsg('Please Fill all fields');
        } else {
            const res = await CreateUserByAdmin({
                name, username, password, re_password: rePassword, email, role
            });
        
            if (res.code >= 400 && res.message !== 'jwt expired') {
                setErrStatus(true);
                setCreateStatus(false);
                setErrMsg(res.message);
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
                }
            } else {
                setErrStatus(false);
                setCreateStatus(true);
            }
        }
    };

    return (
        <>
            <Modal show={showCreate} onHide={() => {
                setShowCreate(false)
                setErrStatus(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>CREATE NEW USER</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={div}>
                        <form onSubmit={handleSubmit} enctype="multipart/form-data">
                            <input 
                                style={input} 
                                type="text" 
                                name="name" 
                                placeholder="Name"
                                onChange={e => setName(e.target.value)}
                            />
                            <input 
                                style={input} 
                                type="text" 
                                name="username" 
                                placeholder="Username"
                                onChange={e => setUsername(e.target.value)}
                            />
                            <input 
                                style={input} 
                                type="password" 
                                name="password" 
                                placeholder="Password"
                                onChange={e => setPassword(e.target.value)}
                            />
                            <input 
                                style={input} 
                                type="password" 
                                name="repeat password" 
                                placeholder="Repeat Password"
                                onChange={e => setRePassword(e.target.value)}
                            />
                            <input 
                                style={input} 
                                type="text" 
                                name="email" 
                                placeholder="Email"
                                onChange={e => setEmail(e.target.value)}
                            />
                            <select 
                                style={input}  
                                id="role" 
                                onChange={e => setRole(e.target.value)}
                            >
                                <option value="0">Role</option>
                                <option value="Guest">Guest</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <input style={button} type="submit" value="Add User" />
                        </form>
                    </div>
                    {errStatus ? ErrorMessage() : (createStatus ? SuccessMessage() : true)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowCreate(false)
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showWarning} onHide={() => setShowWarning(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>WARNING</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure that you want to delete this User</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleDelete()}>
                        Yes
                    </Button>
                    <Button variant="secondary" onClick={() => setShowWarning(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showView} onHide={() => setShowView(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>USER VIEW</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <input 
                        style={input} 
                        type="text" 
                        name="id" 
                        placeholder="Id"
                        value={userView._id}
                    />
                    <input 
                        style={input} 
                        type="text" 
                        name="name" 
                        placeholder="Name"
                        value={userView.name}
                    />
                    <input 
                        style={input} 
                        type="text" 
                        name="username" 
                        placeholder="Username"
                        value={userView.username}
                    />
                    <input 
                        style={input} 
                        type="text" 
                        name="email" 
                        placeholder="Email"
                        value={userView.email}
                    />
                    <input 
                        style={input} 
                        type="text" 
                        name="role" 
                        placeholder="Role"
                        value={userView.role}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowView(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Form className="d-flex justify-content-center" style={{margin: "auto"}}>
                <Form.Control
                    style={{marginTop:"2px", width: "400px"}}
                    value={key}
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={e => setKey(e.target.value)}
                />
                <Button variant="dark" size="sm" onClick={searchBtn}>SEARCH</Button>
            </Form>
            <Button 
                variant="warning" 
                style={{width: "300px"}}
                onClick={() => setShowCreate(true)}
            >ADD NEW USER
            </Button>
            <Row style={{borderBottom: "solid 2px"}}>
                <Col xs={6} md={4}><p style={{fontWeight: "bold"}}>NAME</p></Col>
                <Col xs={6} md={4}><p style={{fontWeight: "bold"}}>EMAIL</p></Col>
                <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>USERNAME</p></Col>
                <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>ACTIONS</p></Col>
            </Row>
            {page === 0 ? <p>page: {page}</p> : paginatedItems}
            <Button 
                variant="primary" 
                style={{width: "200px"}} 
                onClick={() => page === 1 ? setPage(page) : setPage(page - 1)}
            >Previous</Button>
            <p style={{display: "inline-block"}}>{page}</p>
            <Button 
                variant="success" 
                style={{width: "200px"}} 
                onClick={() => page === userNumberPages ? setPage(page) : setPage(page + 1)}
            >Next</Button>
        </>
    )
}

export default User;