import {Col, Container, Nav, Navbar, NavbarBrand, NavItem, NavLink, Row} from "reactstrap";
import {NavLink as RRNavLink, useNavigate} from "react-router-dom";
import {handleLogout} from "store/slices/userSlice.ts";
import {useAppDispatch, useAppSelector} from "store/store.ts";

export const Header = () => {

    const dispatch = useAppDispatch()

    const isAuthenticated = useAppSelector((state) => state.user.is_authenticated)

    const username = useAppSelector((state) => state.user.username)

    const navigate = useNavigate()

    const logout = async (e) => {
        e.preventDefault()
        await dispatch(handleLogout())
        navigate("/")
    }

    return (
        <header>
            <Navbar className="p-3" expand="lg" >
                <Container>
                    <Row>
                        <Col md="6" className="d-flex align-items-center">
                            <NavbarBrand>
                                <NavLink tag={RRNavLink} to="/">
                                     Приемная комиссия МГТУ
                                </NavLink>
                            </NavbarBrand>
                        </Col>
                        <Col md="6" className="d-flex justify-content-end align-items-center">
                            <Nav className="fs-5" navbar>
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/specializations/">
                                        Специальности
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={RRNavLink} to="/faculties/">
                                        Факультеты
                                    </NavLink>
                                </NavItem>
                                {isAuthenticated ?
                                    <>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to="/applicants/">
                                                Абитуриенты
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to="/profile/">
                                                {username}
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink style={{cursor: "pointer"}} onClick={logout}>
                                                Выйти
                                            </NavLink>
                                        </NavItem>
                                    </>
                                    :
                                    <>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to="/login/">
                                                Войти
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={RRNavLink} to="/register/">
                                                Зарегистрироваться
                                            </NavLink>
                                        </NavItem>
                                    </>
                                }
                            </Nav>
                        </Col>
                    </Row>
                </Container>
            </Navbar>
        </header>
    );
};