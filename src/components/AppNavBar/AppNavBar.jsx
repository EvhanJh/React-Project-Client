import {Container, Navbar, Nav, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {useEffect, useState} from "react";
import ModalLogin from "./ModalLogin";
import ModalRegister from "./ModalRegister";

export default function AppNavbar() {
    const [user, setUser] = useState({})
    const [displayModalLogin, setDisplayModalLogin] = useState(false)
    const closeModalLogin = () => setDisplayModalLogin(false)
    const showModalLogin = () => setDisplayModalLogin(true)
    const [displayModalRegister, setDisplayModalResgister] = useState(false)
    const closeModalRegister = () => setDisplayModalResgister(false)
    const showModalRegister = () => setDisplayModalResgister(true)

    useEffect(() => {
        getUser()
    }, [])


    function getUser() {
        if (localStorage.getItem("users") !== null) {
            setUser(localStorage.getItem('users'))
        }
    }

    function logout() {
        localStorage.removeItem('users');
        window.location.reload(false);
    }

    function StatusUser() {
        if(Object.keys(user).length === 0) {
            return (
                <Nav>
                    <Button variant="primary" onClick={showModalLogin}>Connexion</Button>
                    &nbsp;
                    <Button variant="outline-primary" onClick={showModalRegister}>Inscription</Button>
                </Nav>
            )
        } else {
            return (
                <Nav>
                    <Nav.Link as={Link} to="/mymeteo">
                        Mes météos
                    </Nav.Link>
                    <Nav.Link as={Link} to="/myaccount">
                        Mon compte
                    </Nav.Link>
                    <Button variant="danger" onClick={logout}>Deconnexion</Button>
                </Nav>
            )
        }
    }

    return (
        <Navbar bg="dark" expand="lg" className="mb-5" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">Application SPA</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Accueil
                        </Nav.Link>
                        <Nav.Link as={Link} to="/meteo">
                            Météo
                        </Nav.Link>
                    </Nav>
                    <StatusUser />
                </Navbar.Collapse>
            </Container>
            <ModalLogin
                displayModal={displayModalLogin}
                closeModal={closeModalLogin}
                displayModalRegister={showModalRegister}
            />
            <ModalRegister
                displayModal={displayModalRegister}
                closeModal={closeModalRegister}
                displayModalLogin={showModalLogin}
            />
        </Navbar>
    )
}
