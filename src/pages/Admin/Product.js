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
import { RefreshToken } from '../../services/userAPI.js';
import { 
    CreateProduct,
    UpdateProduct,
    DeleteProduct
} from '../../services/productAPI.js';

function Product(props) {
    const products = props.products;
    let productNumberPages = 0;
    const [key, setKey] = useState('');
    const [page, setPage] = useState(1);
    const [paginatedItems, setPaginatedItems] = useState('');
    const [show, setShow] = useState(false);
    const [showView, setShowView] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [warningId, setWarningId] = useState('');
    const [productView, setProductView] = useState({});
    const [updateProduct, setUpdateProduct] = useState(false);
    const [errStatus, setErrStatus] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [createStatus, setCreateStatus] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [qty, setQty] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [details, setDetails] = useState([]);
    const [urls, setUrls] = useState([]);
    const [load, setLoad] = useState(false);

    const submitUpdate = async () => {
        if (qty === '' || price === '') {
            alert("Please enter Qty and Price you need to change!")
        } else {
            const res = await UpdateProduct({id: productView.id, qty: qty, price: price});
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
        }
    };

    useEffect(() => {
        const getUrl = async () => {
            if (process.env.REACT_APP_ENV === 'pro') {
                const app = firebase();
                const storage = getStorage(app);
                const dict = {};
                for (let product of products) {
                    const url = await getDownloadURL(ref(storage, product.image));
                    dict[product.image.toString()] = url
                }
                setUrls(dict);
                setLoad(true);
            }
        }
        getUrl();
    }, []);

    const handleDelete = async () => {
        const res = await DeleteProduct({id: warningId});
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
        const fd = new FormData();        

        if (category === '0' || brand === '0') {
            setErrStatus(true);
            setCreateStatus(false);
            setErrMsg('Please Fill all fields');
        } else {
            fd.append('id', id);
            fd.append('name', name);
            fd.append('qty', qty);
            fd.append('category', category);
            fd.append('brand', brand);
            fd.append('price', price);
            fd.append('image', image, image.name);
            fd.append('details', details);

            const res = await CreateProduct(fd);
            
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

    if (products.length === 0) {
        productNumberPages = 1;
    }
    else if (products.length%4 === 0) {
        productNumberPages = Math.floor(products.length/4);
    } else {
        productNumberPages = Math.floor(products.length/4) + 1;
    }

    function searchBtn() {
        if (key !== '') {
            return true
        }
    };

    useEffect(() => {
        const itemPage = ({item, page}) => {
            let items = [];
            if (page === productNumberPages) {
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
            const products = itemPage({item: properties.products, page});
            if (products.length === 0) {
                return (
                    true
                )
            }
            return (
                <>
                    {products.map(product => (
                        <Row style={{borderBottom: "solid 2px"}}>
                            <Col xs={9} md={6}>{product.name}</Col>
                            <Col xs={3} md={2}>{product.qty}</Col>
                            <Col xs={3} md={2}>
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
                                        setProductView(product)
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
                                        setWarningId(product.id)
                                    }}
                                >Delete</Button>
                            </Col>
                        </Row>
                    ))}
                </>
            )
        }
        if (load) setPaginatedItems(<PaginatedItems products={props.products} />);
    }, [page, load]);

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
        width: "100px",
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
            <Button 
                variant="warning" 
                style={{width: "300px"}}
                onClick={() => setShow(true)}
            >ADD NEW PRODUCT
            </Button>
            <Modal show={showView} onHide={() => {
                setUpdateProduct(false)
                setShowView(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>PRODUCT VIEW</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form >
                        <input 
                            style={inputView} 
                            type="text" 
                            name="id" 
                            placeholder="Id"
                            value={productView.id}
                        />
                        <input 
                            style={inputView} 
                            type="text" 
                            name="name" 
                            placeholder="Name"
                            value={productView.name}
                        />
                        {
                            updateProduct ? 
                            <input 
                                style={inputView} 
                                type="text" 
                                name="qty" 
                                placeholder={`old qty: ${productView.qty}`}
                                onChange={e => setQty(e.target.value)}
                            /> 
                            : 
                            <input 
                                style={inputView} 
                                type="text" 
                                name="qty" 
                                placeholder={"Qty"}
                                value={productView.qty}
                                onChange={e => setQty(e.target.value)}
                            /> 
                        }
                        <input 
                            style={inputView} 
                            type="text" 
                            name="brand" 
                            placeholder="Brand"
                            value={productView.brand}
                        />
                        <input 
                            style={inputView} 
                            type="text" 
                            name="category" 
                            placeholder="Category"
                            value={productView.category}
                        />
                        {
                            updateProduct ? 
                            <input 
                                style={inputView} 
                                type="text" 
                                name="price" 
                                placeholder={`old price: ${productView.price}`}
                                onChange={e => setPrice(e.target.value)}
                            /> 
                            : 
                            <input 
                                style={inputView} 
                                type="text" 
                                name="price" 
                                placeholder={"Price"}
                                value={productView.price}
                                onChange={e => setPrice(e.target.value)}
                            /> 
                        }
                        {process.env.REACT_APP_ENV === 'pro' ? 
                            <img 
                                width="100" 
                                height="100"
                                src={urls[productView.image]} 
                                alt='image product'
                            /> :
                            <img 
                                width="100" 
                                height="100" 
                                crossorigin="anonymous"
                                src={process.env.REACT_APP_HOST + '/' + productView.image}
                                alt='image product' 
                            />
                        }
                        {
                            updateProduct ? 
                            <input 
                                style={inputView} 
                                type="text" 
                                name="details" 
                                placeholder="Details"
                                onChange={e => setDetails(e.target.value)}
                            /> 
                            : 
                            <input 
                                style={inputView} 
                                type="text" 
                                name="details" 
                                placeholder={"Details"}
                                value={productView.details}
                                onChange={e => setDetails(e.target.value)}
                            /> 
                        }
                        <Button 
                            variant="info" 
                            style={{width: "150px"}}
                            onClick={() => {
                                if (updateProduct) {
                                    submitUpdate();
                                } else {
                                    setUpdateProduct(true);
                                }
                            }}
                        >{updateProduct ? 'UPDATE' : 'CHANGE PRODUCT'}
                        </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setUpdateProduct(false)
                        setShowView(false)
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
                    <p>Are you sure that you want to delete this Product</p>
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
            <Modal show={show} onHide={() => {
                setErrStatus(false)
                setCreateStatus(false)
                setShow(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>ADD NEW PRODUCT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={div}>
                        <form onSubmit={handleSubmit} enctype="multipart/form-data">
                            <input 
                                style={input} 
                                type="text" 
                                name="id" 
                                placeholder="Id"
                                onChange={e => setId(e.target.value)}
                            />
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
                                name="qty" 
                                placeholder="Qty"
                                onChange={e => setQty(e.target.value)}
                            />
                            <select 
                                style={input}  
                                id="category" 
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="0">Category</option>
                                {
                                    props.categories.map(cate => (
                                        <option value={cate.name}>{cate.name}</option>
                                    ))
                                }
                            </select>
                            <select style={input}  
                                id="brand" 
                                onChange={e => setBrand(e.target.value)}
                            >
                                <option value="0">Brand</option>
                                {
                                    props.brands.map(b => (
                                        <option value={b.name}>{b.name}</option>
                                    ))
                                }
                            </select>
                            <input 
                                style={input} 
                                type="text" 
                                name="price" 
                                placeholder="Price"
                                onChange={e => setPrice(e.target.value)}
                            />
                            <div>
                                <input 
                                    style={input} 
                                    type="file" 
                                    name="image"
                                    onChange={e => setImage(e.target.files[0])}
                                />
                            </div>
                            <input 
                                style={input} 
                                type="text" 
                                name="details" 
                                placeholder="Details"
                                onChange={e => setDetails(e.target.value)}
                            />
                            <input style={button} type="submit" value="Add Product" />
                        </form>
                    </div>
                    {errStatus ? ErrorMessage() : (createStatus ? SuccessMessage() : true)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setErrStatus(false)
                        setCreateStatus(false)
                        setShow(false)
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row style={{borderBottom: "solid 2px"}}>
                <Col xs={9} md={6}><p style={{fontWeight: "bold"}}>NAME</p></Col>
                <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>QTY</p></Col>
                <Col xs={3} md={2}><p style={{fontWeight: "bold"}}>IMAGE</p></Col>
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
                onClick={() => page === productNumberPages ? setPage(page) : setPage(page + 1)}
            >Next</Button>
        </>
    )
}

export default Product;