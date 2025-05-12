import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import DocumentValidator from './components/DocumentValidator/DocumentValidator';
import BiometricValidator from './components/BiometricValidator/BiometricValidator';
import FacialRecognition from './components/FacialRecognition/FacialRecognition';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import authService from './services/auth';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        <Navbar bg="primary-dark" variant="dark" expand="lg" className="custom-navbar">
          <Container>
            <Navbar.Brand as={Link} to="/">QUOD Validação</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/documentos">Validação de Documentos</Nav.Link>
                <Nav.Link as={Link} to="/biometria/digital">Validação Biométrica (Digital)</Nav.Link>
                <Nav.Link as={Link} to="/biometria/facial">Validação Facial</Nav.Link>
              </Nav>
              <Nav>
                {isAuthenticated ? (
                  <Button 
                    variant="outline-light" 
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    Sair
                  </Button>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Registrar</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/documentos" 
              element={
                <ProtectedRoute>
                  <DocumentValidator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/biometria/digital" 
              element={
                <ProtectedRoute>
                  <BiometricValidator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/biometria/facial" 
              element={
                <ProtectedRoute>
                  <FacialRecognition />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

function Home() {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="home-container">
      <Card className="text-center main-card">
        <Card.Body>
          <h1>Sistema de Validação QUOD</h1>
          <p className="lead">
            Bem-vindo ao sistema de validação de documentos e biometria. 
            Selecione uma opção abaixo para começar.
          </p>
          <hr className="my-4" />
          <div className="d-flex justify-content-center gap-3 action-buttons">
            <Link to="/documentos" className="btn btn-documents btn-lg">
              Validar Documentos
            </Link>
            <Link to="/biometria/digital" className="btn btn-biometric btn-lg">
              Validar Biometria Digital
            </Link>
            <Link to="/biometria/facial" className="btn btn-facial btn-lg">
              Validar Biometria Facial
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default App; 