import {Col, Container, Nav, Navbar, NavbarBrand, NavItem, NavLink, Row} from "reactstrap";
import {NavLink as RRNavLink} from "react-router-dom";

const Header = () => {
    return (
		<header>
			<Navbar className="p-3" expand="lg">
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
							<Nav className="fs-5 gap-3" navbar>
								<NavItem>
									<NavLink tag={RRNavLink} to="/">
										Главная
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink tag={RRNavLink} to="/specializations">
										Специальности
									</NavLink>
								</NavItem>
							</Nav>
						</Col>
					</Row>
				</Container>
			</Navbar>
		</header>
    );
};

export default Header