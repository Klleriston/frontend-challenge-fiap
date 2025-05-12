import { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth';
import './Register.css';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (userData.password !== userData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const { name, email, password } = userData;
      const result = await authService.register(name, email, password);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Cadastro realizado com sucesso. Por favor, faça login para continuar.',
              email: email 
            } 
          });
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao registrar. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6} lg={5}>
          <Card className="register-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Criar Conta</h2>
                <p className="text-muted">Registre-se para acessar o sistema</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-4">
                  Cadastro realizado com sucesso! Redirecionando para a página de login...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                    className="custom-input"
                    disabled={loading || success}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                    className="custom-input"
                    disabled={loading || success}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="********"
                    required
                    className="custom-input"
                    minLength="6"
                    disabled={loading || success}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    placeholder="********"
                    required
                    className="custom-input"
                    minLength="6"
                    disabled={loading || success}
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading || success}
                  className="w-100 btn-register"
                >
                  {loading ? 'Registrando...' : success ? 'Registrado com sucesso!' : 'Registrar'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p>
                  Já tem uma conta?{' '}
                  <Link to="/login" className="login-link">
                    Faça login
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register; 