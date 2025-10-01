import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./Menu.css";

export default function Menu() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  
  return (
    <>
      <Navbar expand="lg" className="menu-container custom-navbar">
        <Container fluid>
          <Navbar.Brand as={Link} to="/dashboard" className="custom-brand">
            Cementerio Admin
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0 custom-nav"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/dashboard">
                <i className="bi bi-house-door"></i> Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/difuntos">
                <i className="bi bi-clipboard-x"></i> Difuntos
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/encargados">
                <i className="bi bi-person-fill"></i> Encargados
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/locaciones">
                <i className="bi bi-geo-alt"></i> Locaciones
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/panteones">
                <i className="bi bi-building"></i> Panteones
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/espacios">
                <i className="bi bi-grid-3x3"></i> Espacios
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/transacciones">
                <i className="bi bi-cash-coin"></i> Transacciones
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/deudores">
                <i className="bi bi-exclamation-triangle"></i> Deudores
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/reportes">
                <i className="bi bi-file-earmark-bar-graph"></i> Reportes
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/movimientos">
                <i class="bi bi-arrow-left-right"></i> Movimientos
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link
                onClick={handleLogout}
                className="btn custom-logout ms-2"
              >
                <i className="bi bi-box-arrow-right"></i> Cerrar sesión
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}