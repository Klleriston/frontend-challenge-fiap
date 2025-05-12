import { useState, useRef } from 'react';
import { Form, Button, Card, Alert, Tabs, Tab, Row, Col } from 'react-bootstrap';
import Webcam from 'react-webcam';
import { biometricService } from '../../services/api';
import './FacialRecognition.css';

const FacialRecognition = () => {
  const webcamRef = useRef(null);
  const [activeTab, setActiveTab] = useState('url');
  const [imageUrl, setImageUrl] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setResult(null);
    setError(null);
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
  };

  const validateWithUrl = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await biometricService.validateFacialBiometry(imageUrl);
      setResult(response.data);
    } catch (err) {
      setError('Erro ao validar biometria facial. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateWithCapture = async () => {
    if (!capturedImage) {
      setError('Por favor, capture uma imagem primeiro.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await biometricService.validateFacialBiometryBase64(capturedImage);
      setResult(response.data);
    } catch (err) {
      setError('Erro ao validar biometria facial. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="facial-recognition">
      <h2 className="section-title">Validação de Biometria Facial</h2>
      
      <Tabs 
        activeKey={activeTab} 
        onSelect={handleTabChange}
        className="custom-tabs mb-3 mt-4"
      >
        <Tab eventKey="url" title="URL da Imagem">
          <Card className="tab-content-card">
            <Card.Body>
              <Form onSubmit={validateWithUrl}>
                <Form.Group className="mb-3">
                  <Form.Label>URL da Imagem Facial</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://exemplo.com/foto-rosto.jpg"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    required
                    className="custom-input"
                  />
                  <Form.Text className="text-muted">
                    Forneça a URL de uma imagem contendo o rosto para validação.
                  </Form.Text>
                </Form.Group>
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                  className="btn-accent"
                >
                  {loading ? 'Validando...' : 'Validar com URL'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="webcam" title="Capturar pela Webcam">
          <Card className="tab-content-card">
            <Card.Body>
              {!capturedImage ? (
                <div className="text-center webcam-container">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={480}
                    height={360}
                    videoConstraints={{
                      width: 480,
                      height: 360,
                      facingMode: "user"
                    }}
                    className="webcam mb-3"
                  />
                  <Button 
                    variant="success" 
                    onClick={captureImage} 
                    className="d-block w-100 btn-capture"
                  >
                    Capturar Imagem
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <h5 className="mb-3">Imagem Capturada:</h5>
                  <div className="captured-image-container">
                    <img 
                      src={capturedImage} 
                      alt="Imagem capturada" 
                      width={480} 
                      height={360}
                      className="captured-image mb-3"
                    />
                  </div>
                  <Row className="mt-3 action-buttons">
                    <Col>
                      <Button 
                        variant="warning" 
                        onClick={resetCapture} 
                        className="d-block w-100 btn-recapture"
                      >
                        Capturar Novamente
                      </Button>
                    </Col>
                    <Col>
                      <Button 
                        variant="primary" 
                        onClick={validateWithCapture}
                        disabled={loading}
                        className="d-block w-100 btn-validate"
                      >
                        {loading ? 'Validando...' : 'Validar Imagem'}
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {result && (
        <Alert 
          variant={result.valido ? 'success' : 'danger'} 
          className={`mt-4 result-alert ${result.valido ? 'success-alert' : 'error-alert'}`}
        >
          <Alert.Heading>
            {result.valido ? 'Biometria Facial Válida' : 'Biometria Facial Inválida'}
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

export default FacialRecognition; 