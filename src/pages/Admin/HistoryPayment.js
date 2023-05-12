import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { 
    RefreshToken 
} from '../../services/userAPI.js';
import { 
    GetUserByAdmin 
} from '../../services/userAPI.js';

function Payment(props) {
    const historyPayments = props.historyPayments;
    let paymentNumberPages = 0;
    const [key, setKey] = useState('');
    const [page, setPage] = useState(1);
    const [paginatedItems, setPaginatedItems] = useState('');
    const [showView, setShowView] = useState(false);
    const [cartView, setCartView] = useState([]);
    const [user, setUser] = useState([]);

    if (historyPayments.length === 0) {
        paymentNumberPages = 1;
    }
    else if (historyPayments.length%4 === 0) {
        paymentNumberPages = Math.floor(historyPayments.length/4);
    } else {
        paymentNumberPages = Math.floor(historyPayments.length/4) + 1;
    }

    function searchBtn() {
        if (key !== '') {
            return true
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

        const TotalQty = (cart) => {
            let total = 0;
            for (let c of cart) {
                total = total + c.qty;
            }
            return total;
        }

        function PaginatedItems (properties) {
            const carts = itemPage({item: properties.historyPayments, page});
            
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
                            <Col xs={3} md={2}>{TotalQty(cart.carts)}</Col>
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
                            </Col>
                        </Row>
                    ))}
                </>
            )
        }
        setPaginatedItems(<PaginatedItems historyPayments={historyPayments} />);
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
                                <img 
                                    width="100" 
                                    height="100"
                                    style={{marginTop: "10px"}}
                                    crossorigin="anonymous"
                                    src={process.env.REACT_APP_HOST + '/' + product.image} 
                                    alt='image product'
                                />

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
            <Row style={{borderBottom: "solid 2px"}}>
                <Col xs={9} md={6}><p style={{fontWeight: "bold"}}>ID</p></Col>
                <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>TOTAL PRODUCT</p></Col>
                <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>PRICE</p></Col>
                <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>ACTION</p></Col>
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