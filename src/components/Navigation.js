import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { MDBIcon } from 'mdb-react-ui-kit';
import { useState } from "react";

function Navigation () {
    const tag_p = {
        margin: "10px"
    };

    const [key, setKey] = useState('');

    function searchProducts() {
        if (key !== '') {
            let path = `/product/search?k=`+key; 
            window.location.href = path;
        }
    };

    const handleKeyPress = (event) => {
        if(event.key === 'Enter') {
            searchProducts();
        }
    };

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link href="/" ><p style={tag_p} className="font-weight-bold fs-4">HOME</p></Nav.Link>
                </Nav>
                <Form className="d-flex">
                    <Form.Control
                        style={{marginTop:"2px"}}
                        value={key}
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        onChange={e => setKey(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button variant="light" size="sm" onClick={searchProducts}>SEARCH</Button>
                </Form>
                {localStorage.getItem('role') === 'Admin' &&
                    <Nav className="justify-content-end">
                        <Nav.Link href="/admin-page"><p style={tag_p} className="font-weight-bold fs-4">ADMIN</p></Nav.Link>
                    </Nav>
                }
                {!localStorage.getItem('nameUser') &&
                    <Nav className="justify-content-end">
                        <Nav.Link href="/login"><p style={tag_p} className="font-weight-bold fs-4">SIGN IN</p></Nav.Link>
                        <Nav.Link href="/register"><p style={tag_p} className="font-weight-bold fs-4">SIGN UP</p></Nav.Link>
                    </Nav>
                }
                {localStorage.getItem('nameUser') &&
                    <Nav className="justify-content-end">
                        <Nav>
                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title={localStorage.getItem('nameUser').toUpperCase()}
                                menuVariant="dark"
                                style={{marginTop: "18px"}}
                            >
                                <NavDropdown.Item href={`/user/${localStorage.getItem('idUser')}`}>
                                    Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item href={`/user/cart/${localStorage.getItem('idUser')}`}>
                                    Cart
                                </NavDropdown.Item>
                                <NavDropdown.Item href={`/user/payment/${localStorage.getItem('idUser')}`}>
                                    Payment
                                </NavDropdown.Item>
                                <NavDropdown.Item href={`/user/history-payment/${localStorage.getItem('idUser')}`}>
                                    Payment History
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav.Link href="/logout"><p style={tag_p} className="font-weight-bold fs-4">SIGN OUT</p></Nav.Link>
                        <Nav.Link href={`/user/cart/${localStorage.getItem('idUser')}`}>
                            <MDBIcon color='light' icon='shopping-basket' className='me-3' size='2x' style={{margin: "10px"}} />
                        </Nav.Link>
                    </Nav>
                }
            </Container>
        </Navbar>
    );
}

export default Navigation;