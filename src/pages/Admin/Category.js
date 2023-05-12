import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { 
    CreateCategory,
    DeleteCategory
} from '../../services/categoryAPI.js';
import { RefreshToken } from '../../services/userAPI.js';

function Category(props) {
    const categories = props.categories;
    let categoryNumberPages = 0;
    const [key, setKey] = useState('');
    const [page, setPage] = useState(1);
    const [paginatedItems, setPaginatedItems] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [errStatus, setErrStatus] = useState(false);
    const [createStatus, setCreateStatus] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [warningId, setWarningId] = useState('');
    const [showView, setShowView] = useState(false);
    const [categoryView, setCategoryView] = useState({});

    if (categories.length%4 === 0) {
        categoryNumberPages = Math.floor(categories.length/4);
    } else {
        categoryNumberPages = Math.floor(categories.length/4) + 1;
    }

    function searchBtn() {
        if (key !== '') {
            return true
        }
    };

    useEffect(() => {
        const itemPage = ({item, page}) => {
            let items = [];
            if (page === categoryNumberPages) {
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
            const categories = itemPage({item: properties.categories, page});
            return (
                <>
                    {categories.map(category => (
                        <Row style={{borderBottom: "solid 2px"}}>
                            <Col xs={9} md={6}>{category.name}</Col>
                            <Col xs={9} md={6}>
                                <Button 
                                    variant="info"
                                    style={{
                                        fontSize: "10px",
                                        height: "50px",
                                        width: "130px"
                                    }}
                                    onClick={() => {
                                        setShowView(true)
                                        setCategoryView(category)
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
                                        setWarningId(category.id)
                                    }}
                                >Delete</Button>
                            </Col>
                        </Row>
                    ))}
                </>
            )
        }
        setPaginatedItems(<PaginatedItems categories={props.categories} />);
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
        const res = await DeleteCategory({id: warningId});
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

        const res = await CreateCategory({id, name});
        
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
    };

    return (
        <>
            <Modal show={showCreate} onHide={() => {
                setShowCreate(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>CREATE NEW CATEGORY</Modal.Title>
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
                            <input style={button} type="submit" value="Add Category" />
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
                    <p>Are you sure that you want to delete this Category</p>
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
                    <Modal.Title>CATEGORY VIEW</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input 
                        style={inputView} 
                        type="text" 
                        name="id" 
                        placeholder="Id"
                        value={categoryView.id}
                    />
                    <input 
                        style={inputView} 
                        type="text" 
                        name="name" 
                        placeholder="Name"
                        value={categoryView.name}
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
            >ADD NEW CATEGORY
            </Button>
            <Row style={{borderBottom: "solid 2px"}}>
                <Col xs={9} md={6}><p style={{fontWeight: "bold"}}>NAME</p></Col>
                <Col xs={9} md={6}><p style={{fontWeight: "bold"}}>ACTIONS</p></Col>
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
                onClick={() => page === categoryNumberPages ? setPage(page) : setPage(page + 1)}
            >Next</Button>
        </>
    )
}

export default Category;