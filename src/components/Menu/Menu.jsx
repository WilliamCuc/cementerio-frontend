import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Menu.css";

export default function Menu() {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary menu-container">
        <Container fluid>
          <Navbar.Brand as={Link} to="/dashboard">
            Cementerio Admin
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/dashboard">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/difuntos">
                Difuntos
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/encargados">
                Encargados
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
