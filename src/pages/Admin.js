import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { 
    MDBFooter, 
    MDBIcon 
} from 'mdb-react-ui-kit';
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import Product from './Admin/Product.js';
import User from './Admin/User.js';
import Category from './Admin/Category.js';
import Brand from './Admin/Brand.js';
import Payment from './Admin/Payment.js';
import HistoryPayment from './Admin/HistoryPayment.js';
// call api
import { 
    GetAllBrands 
} from '../services/brandAPI';
import { 
    GetAllCategories 
} from '../services/categoryAPI';
import { 
    GetAllProducts 
} from '../services/productAPI.js';
import {
    GetAllUsers,
    RefreshToken
} from '../services/userAPI.js';
import { 
    GetAllPayments,
    GetAllHistoryPayments 
} from '../services/paymentAPI.js';

const title = "Admin Page";

function Admin () {
    document.title = title.toUpperCase();

    const [users, setUsers] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [payments, setPayments] = useState([]);
    const [historyPayments, setHistoryPayments] = useState([]);
    const [task, setTask] = useState('');
    const [errStatus, setErrStatus] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        const getAllBrands = async () => {
            const brands = await GetAllBrands();
            setBrands(brands);
        }
        getAllBrands();
    }, [])
    useEffect(() => {
        const getAllCategories = async () => {
            const categories = await GetAllCategories();
            setCategories(categories);
        }
        getAllCategories();
    }, [])
    useEffect(() => {
        const getAllProducts = async () => {
            const products = await GetAllProducts();
            setProducts(products);
        }
        getAllProducts();
    }, [])
    useEffect(() => {
        const getAllUsers = async () => {
            const res = await GetAllUsers();
            if (res.code >= 400 && res.message !== 'jwt expired') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('idUser');
                localStorage.removeItem('nameUser');
                localStorage.removeItem('role');
                setErrStatus(true);
                setErrMsg(res.message);
            }
            else if (res.code === 401 && res.message === 'jwt expired') {
                const response = await RefreshToken();
                if (response.code >= 400) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('idUser');
                    localStorage.removeItem('nameUser');
                    localStorage.removeItem('role');
                    Cookies.remove('refreshToken');
                    setErrStatus(true);
                    setErrMsg(res.message);
                } else {
                    const accessToken = response.accessToken;
                    localStorage.setItem('accessToken', accessToken);
                    const responses = await GetAllUsers();
                    setUsers(responses.users);
                }
            } else {
                setUsers(res.users);
            }
        };
        getAllUsers();
    }, [])

    useEffect(() => {
        const getAllPayments = async () => {
            const res = await GetAllPayments();
            if (res.code >= 400 && res.message !== 'jwt expired') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('idUser');
                localStorage.removeItem('nameUser');
                localStorage.removeItem('role');
                setErrStatus(true);
                setErrMsg(res.message);
            }
            else if (res.code === 401 && res.message === 'jwt expired') {
                const response = await RefreshToken();
                if (response.code >= 400) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('idUser');
                    localStorage.removeItem('nameUser');
                    localStorage.removeItem('role');
                    Cookies.remove('refreshToken');
                    setErrStatus(true);
                    setErrMsg(res.message);
                } else {
                    const accessToken = response.accessToken;
                    localStorage.setItem('accessToken', accessToken);
                    const responses = await GetAllPayments();
                    setPayments(responses.metadata);
                }
            } else {
                setPayments(res.metadata);
            }
        };
        getAllPayments();
    }, [])

    useEffect(() => {
        const getAllHistoryPayments = async () => {
            const res = await GetAllHistoryPayments();
            if (res.code >= 400 && res.message !== 'jwt expired') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('idUser');
                localStorage.removeItem('nameUser');
                localStorage.removeItem('role');
                setErrStatus(true);
                setErrMsg(res.message);
            }
            else if (res.code === 401 && res.message === 'jwt expired') {
                const response = await RefreshToken();
                if (response.code >= 400) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('idUser');
                    localStorage.removeItem('nameUser');
                    localStorage.removeItem('role');
                    Cookies.remove('refreshToken');
                    setErrStatus(true);
                    setErrMsg(res.message);
                } else {
                    const accessToken = response.accessToken;
                    localStorage.setItem('accessToken', accessToken);
                    const responses = await GetAllHistoryPayments();
                    setHistoryPayments(responses.metadata);
                }
            } else {
                setHistoryPayments(res.metadata);
            }
        };
        getAllHistoryPayments();
    }, [])


    const btn_default = {
        width: "300px"
    };

    function ShowDefault() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Button variant="primary" style={btn_default}>Total Users: {users.length}</Button>
                    </Col>
                    <Col>
                        <Button variant="success" style={btn_default}>Total Brands: {brands.length}</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="info" style={btn_default}>Total Categories: {categories.length}</Button>
                    </Col>
                    <Col>
                        <Button variant="warning" style={btn_default}>Total Products: {products.length}</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="secondary" style={btn_default}>Total Payments: {payments.length}</Button>
                    </Col>
                    <Col>
                        <Button variant="danger" style={btn_default}>Total History: {historyPayments.length}</Button>
                    </Col>
                </Row>
            </Container>
        )
    }

    const tag_p = {
        margin: "10px"
    };

    const colRight = {
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px", 
        backgroundColor: "white"
    };

    const colLeft = {
        marginTop: "20px",
        marginLeft: "30px"
    };

    const HandleTask = (task) => {
        if (task === 'Products') {
            setTask(<Product products={products} categories={categories} brands={brands} />)
        } else if (task === 'Users') {
            setTask(<User users={users} />)
        } else if (task === 'Categories') {
            setTask(<Category categories={categories} />)
        } else if (task === 'Brands') {
            setTask(<Brand brands={brands} />)
        } else if (task === 'Payment') {
            setTask(<Payment payments={payments} />)
        } else {
            setTask(<HistoryPayment historyPayments={historyPayments} />)
        }
    };

    if (errStatus) {
        return (
            <>
                <p>{errMsg}</p>
                <p><a href='/'>Back to Home Page</a></p>
            </>
        )
    }

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => window.location.reload(false)}>
                            <p style={tag_p} className="font-weight-bold fs-4">
                                KHOI NGUYEN STORE
                            </p>
                        </Nav.Link>
                    </Nav>
                    <Nav className="justify-content-end">
                        <Nav.Link href="/"><p style={tag_p} className="font-weight-bold fs-4">HOME</p></Nav.Link>
                    </Nav>
                    <Nav className="justify-content-end">
                        <Nav.Link href="/logout"><p style={tag_p} className="font-weight-bold fs-4">SIGN OUT</p></Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container className="vh-100 d-flex flex-column bg-dark" fluid>
                <Row className="h-100">
                    <Col xs={4} md={3} className='text-white'>
                        <p style={colLeft}>
                            <a onClick={() => HandleTask('Users')}><MDBIcon color='white' icon='user-alt' className='me-3' />
                                Users
                            </a>
                        </p>
                        <p style={colLeft}>
                            <a onClick={() => HandleTask('Products')}><MDBIcon color='white' icon='box' className='me-3' />
                                Products
                            </a>
                        </p>
                        <p style={colLeft}>
                            <a onClick={() => HandleTask('Brands')}><MDBIcon color='white' icon='tag' className='me-3' />
                                Brands
                            </a>
                        </p>
                        <p style={colLeft}>
                            <a onClick={() => HandleTask('Categories')}><MDBIcon color='white' icon='layer-group' className='me-3' />
                                Categories
                            </a>
                        </p>
                        <p style={colLeft}>
                            <a onClick={() => HandleTask('Payment')}><MDBIcon color='white' icon='layer-group' className='me-3' />
                                Payment
                            </a>
                        </p>
                        <p style={colLeft}>
                            <a onClick={() => HandleTask('Payment History')}><MDBIcon color='white' icon='layer-group' className='me-3' />
                                Payment History
                            </a>
                        </p>
                    </Col>
                    <Col xs={12} md={9} style={colRight} className='bg-light'>
                        {task === '' ? <ShowDefault /> : task}
                    </Col>
                </Row>
            </Container>
            <MDBFooter bgColor='dark' className='text-center text-lg-start text-muted'>
                <div className='text-center p-4 text-white'>
                    © 2023 Copyright
                </div>
            </MDBFooter>
        </>
    )
}

export default Admin;