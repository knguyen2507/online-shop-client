import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// firebase
import { firebase } from '../../services/firebase';
// api
import { 
    RefreshToken 
} from '../../services/userAPI.js';
import { 
    CancelPaymentByAdmin, 
    ConfirmPayment
} from '../../services/paymentAPI.js';
import { 
    GetUserByAdmin 
} from '../../services/userAPI.js';

function Payment(props) {
    const payments = props.payments;
    let paymentNumberPages = 0;
    const [key, setKey] = useState('');
    const [page, setPage] = useState(1);
    const [paginatedItems, setPaginatedItems] = useState('');
    const [showView, setShowView] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [cartView, setCartView] = useState([]);
    const [warningId, setWarningId] = useState({});
    const [confirmId, setConfirmId] = useState({});
    const [user, setUser] = useState([]);
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        const getUrls = async () => {
            if (process.env.REACT_APP_ENV === 'pro' && cartView.length > 0) {
                const app = firebase();
                const storage = getStorage(app);
                const dict = {};
                for (let product of cartView) {
                    const url = await getDownloadURL(ref(storage, product.image));
                    dict[product.image.toString()] = url
                }
                setUrls(dict)
            } else {
                return true
            }
        };
        getUrls();
    }, [cartView])

    if (payments.length === 0) {
        paymentNumberPages = 1;
    }
    else if (payments.length%4 === 0) {
        paymentNumberPages = Math.floor(payments.length/4);
    } else {
        paymentNumberPages = Math.floor(payments.length/4) + 1;
    }

    const handleCancel = async () => {
        const res = await CancelPaymentByAdmin({id: warningId});
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
                const resp = await CancelPaymentByAdmin({id: warningId});
                alert(resp.message);
                window.location.reload(false);
            }
        } else {
            alert(res.message);
            window.location.reload(false);
        }
    };

    const handleConfirm = async () => {
        const res = await ConfirmPayment({id: confirmId});
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
                const resp = await ConfirmPayment({id: confirmId});
                alert(resp.message);
                window.location.reload(false);
            }
        } else {
            alert(res.message);
            window.location.reload(false);
        }
    };

    const getUser = async (userId) => {
        const res = await GetUserByAdmin({id: userId});
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
                const resp = await GetUserByAdmin({id: userId});
                setUser(resp.user)
            }
        } else {
            setUser(res.user)
        }
    }

    function searchBtn() {
        if (key !== '') {
            return true
        }
    };

    useEffect(() => {
        const itemPage = ({item, page}) => {
            let items = [];
            if (page === paymentNumberPages) {
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

        const TotalPrice = (cart) => {
            let total = 0;
            for (let c of cart) {
                total = total + c.price*c.qty;
            }
            return total;
        }

        function PaginatedItems (properties) {
            const carts = itemPage({item: properties.payments, page});
            
            if (carts.length === 0) {
                return (
                    true
                )
            }
            return (
                <>
                    {carts.map(cart => (
                        <Row style={{borderBottom: "solid 2px"}}>
                            <Col xs={9} md={6}>{cart._id}</Col>
                            <Col xs={3} md={2}>{TotalPrice(cart.carts)}</Col>
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
                                        setCartView(cart.carts)
                                        getUser(cart.id)
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
                                        setWarningId(cart._id)
                                    }}
                                >Cancel</Button>
                            </Col>
                            <Col xs={3} md={2}>
                                <Button 
                                    variant="success"
                                    style={{
                                        fontSize: "10px",
                                        height: "50px",
                                        width: "130px"
                                    }}
                                    onClick={() => {
                                        setShowConfirm(true)
                                        setConfirmId(cart._id)
                                    }}
                                >Confirm</Button>
                            </Col>
                        </Row>
                    ))}
                </>
            )
        }
        setPaginatedItems(<PaginatedItems payments={payments} />);
    }, [page]);

    return (
        <>
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
            </Form >
            <Modal show={showView} onHide={() => setShowView(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>VIEW</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>User ID: {user._id}</p>
                        <p style={{borderBottom: "solid 2px"}}>Name User: {user.name}</p>
                        {cartView.map(product => (
                            <div style={{borderBottom: "solid 2px"}}>
                                <p>Name: {product.name}</p>
                                <p>Qty: {product.qty}</p>
                                <p>Price: {product.price}</p>
                                {process.env.REACT_APP_ENV === 'pro' ? 
                                    <img 
                                        width="100" 
                                        height="100"
                                        style={{marginTop: "10px"}}
                                        src={urls[product.image]} 
                                        alt='image product'
                                    /> :
                                    <img 
                                        width="100" 
                                        height="100"
                                        style={{marginTop: "10px"}}
                                        crossorigin="anonymous"
                                        src={process.env.REACT_APP_HOST + '/' + product.image} 
                                        alt='image product'
                                    />
                                }
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowView(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showWarning} onHide={() => setShowWarning(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>WARNING</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure that you want to cancel this Payment</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCancel()}>
                        Yes
                    </Button>
                    <Button variant="secondary" onClick={() => setShowWarning(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>PAYMENT CONFIRMATION</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Order has been paid</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleConfirm()}>
                        Yes
                    </Button>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>            
            <Row style={{borderBottom: "solid 2px"}}>
                <Col xs={9} md={6}><p style={{fontWeight: "bold"}}>ID</p></Col>
                <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>PRICE</p></Col>
                <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>ACTION</p></Col>
                <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>CONFIRM</p></Col>
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
                onClick={() => page === paymentNumberPages ? setPage(page) : setPage(page + 1)}
            >Next</Button>
        </>
    )
}

export default Payment;