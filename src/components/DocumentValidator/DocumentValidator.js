import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { documentService } from '../../services/api';
import './DocumentValidator.css';

const DocumentValidator = () => {
  const [formData, setFormData] = useState({
    cpf: '',
    rg: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const formatCPF = (value) => {
    const numericValue = value.replace(/\D/g, '');
    
    const truncated = numericValue.slice(0, 11);
    
    if (truncated.length <= 3) {
      return truncated;
    } else if (truncated.length <= 6) {
      return `${truncated.slice(0, 3)}.${truncated.slice(3)}`;
    } else if (truncated.length <= 9) {
      return `${truncated.slice(0, 3)}.${truncated.slice(3, 6)}.${truncated.slice(6)}`;
    } else {
      return `${truncated.slice(0, 3)}.${truncated.slice(3, 6)}.${truncated.slice(6, 9)}-${truncated.slice(9)}`;
    }
  };
  
  const formatRG = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const truncated = numericValue.slice(0, 9);
    
    if (truncated.length <= 2) {
      return truncated;
    } else if (truncated.length <= 5) {
      return `${truncated.slice(0, 2)}.${truncated.slice(2)}`;
    } else if (truncated.length <= 8) {
      return `${truncated.slice(0, 2)}.${truncated.slice(2, 5)}.${truncated.slice(5)}`;
    } else {
      return `${truncated.slice(0, 2)}.${truncated.slice(2, 5)}.${truncated.slice(5, 8)}-${truncated.slice(8)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'rg') {
      formattedValue = formatRG(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateDocument = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const cleanedData = {
        cpf: formData.cpf.replace(/\D/g, ''),
        rg: formData.rg.replace(/\D/g, '')
      };
      
      const response = await documentService.validateDocument(cleanedData);
      setResult(response.data);
    } catch (err) {
      setError('Erro ao validar documentos. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isResultValid = (result) => {
    if (!result) return false;
    
    if (result.status && ['SUCESSO'].includes(result.status.toUpperCase())) {
      return true;
    }
    
    if (result.mensagem && (
      result.mensagem.toLowerCase().includes('SUCESSO')
    )) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="document-validator">
      <h2 className="section-title">Validação de Documentos</h2>
      <Card className="form-card mt-4">
        <Card.Body>
          <Form onSubmit={validateDocument}>
            <Form.Group className="mb-3">
              <Form.Label>CPF</Form.Label>
              <Form.Control
                type="text"
                name="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
                maxLength={14}
                required
                className="custom-input"
              />
              <Form.Text className="input-helper">
                Formato: 000.000.000-00
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>RG</Form.Label>
              <Form.Control
                type="text"
                name="rg"
                placeholder="00.000.000-0"
                value={formData.rg}
                onChange={handleChange}
                maxLength={12}
                required
                className="custom-input"
              />
              <Form.Text className="input-helper">
                Formato: 00.000.000-0
              </Form.Text>
            </Form.Group>

            <Button 
              type="submit" 
              disabled={loading}
              className="btn-document-submit"
            >
              {loading ? 'Validando...' : 'Validar Documentos'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {result && (
        <Alert 
          variant={isResultValid(result) ? 'success' : 'danger'} 
          className={`mt-4 result-alert ${isResultValid(result) ? 'success-alert' : 'error-alert'}`}
        >
          <Alert.Heading>
            {isResultValid(result) ? 'Documentos Válidos' : 'Documentos Inválidos'}
          </Alert.Heading>
          <p>{result.mensagem}</p>
          {result.detalheValidacao && (
            <div className="mt-2 validation-details">
              <strong>Detalhes da Validação:</strong>
              <p>{result.detalheValidacao}</p>
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

export default DocumentValidator;