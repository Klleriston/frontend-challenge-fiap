import { useState } from 'react';
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { biometricService } from '../../services/api';
import './BiometricValidator.css';

const BiometricValidator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setImageUrl(e.target.value);
  };

  const validateBiometry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await biometricService.validateDigitalBiometry(imageUrl);
      setResult(response.data);
    } catch (err) {
      setError('Erro ao validar biometria digital. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="biometric-validator">
      <h2 className="section-title">Validação de Biometria Digital</h2>
      <Card className="form-card mt-4">
        <Card.Body>
          <Form onSubmit={validateBiometry}>
            <Form.Group className="mb-3">
              <Form.Label>URL da Imagem Digital</Form.Label>
              <InputGroup>
                <Form.Control
                  type="url"
                  placeholder="https://exemplo.com/imagem-digital.jpg"
                  value={imageUrl}
                  onChange={handleChange}
                  required
                  className="custom-input"
                />
              </InputGroup>
              <Form.Text className="text-muted">
                Forneça a URL de uma imagem contendo a digital para validação.
              </Form.Text>
            </Form.Group>

            <Button 
              type="submit" 
              disabled={loading}
              className="bg-white border-black text-black"
            >
              {loading ? 'Validando...' : 'Validar Biometria Digital'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {result && (
        <Alert 
          variant={result.valido ? 'success' : 'danger'} 
          className={`mt-4 result-alert ${result.valido ? 'success-alert' : 'error-alert'}`}
        >
          <Alert.Heading>
            {result.valido ? 'Biometria Válida' : 'Biometria Inválida'}
          </Alert.Heading>
          <p>{result.mensagem}</p>
          {result.statusDetalhado && (
            <div className="mt-2 details-section">
              <strong>Detalhes:</strong>
              <p>{result.statusDetalhado}</p>
            </div>
          )}
          {result.transacaoId && (
            <div className="mt-2 transaction-id">
              <strong>ID da Transação:</strong> {result.transacaoId}
            </div>
          )}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mt-4 error-alert">
          <Alert.Heading>Erro</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}
    </div>
  );
};

export default BiometricValidator; 