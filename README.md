# Cliente para QUOD Validação

Este é o cliente (frontend) para o sistema de validação QUOD, que permite validar documentos e biometria.

## Funcionalidades

- Validação de documentos (CPF e RG)
- Validação de biometria digital via URL de imagem
- Validação de biometria facial via URL ou webcam (captura em tempo real)

## Tecnologias Utilizadas

- React 18
- React Router 6
- Axios para chamadas de API
- React Bootstrap para interface
- React Webcam para captura de imagens

## Requisitos

- Node.js 14.0 ou superior
- NPM 6.0 ou superior

## Instalação

1. Clone o repositório
2. Navegue até a pasta do cliente:
```
cd client
```
3. Instale as dependências:
```
npm install
```
4. Inicie o servidor de desenvolvimento:
```
npm start
```

## Uso

O aplicativo estará disponível em http://localhost:3000

### Rotas Disponíveis:

- `/documentos` - Validação de documentos (CPF e RG)
- `/biometria/digital` - Validação de biometria digital via URL
- `/biometria/facial` - Validação de biometria facial via URL ou webcam

## Configuração

O arquivo `package.json` inclui um proxy para http://localhost:8080, que deve ser o endereço onde o backend está sendo executado. Se o backend estiver em um endereço diferente, altere essa configuração.

## Estrutura do Projeto

```
client/
  ├── public/              # Arquivos públicos
  ├── src/                 # Código fonte
  │   ├── components/      # Componentes React
  │   │   ├── BiometricValidator/    # Componentes para validação de biometria digital
  │   │   ├── DocumentValidator/     # Componentes para validação de documentos
  │   │   └── FacialRecognition/     # Componentes para reconhecimento facial
  │   ├── services/        # Serviços e APIs
  │   ├── App.js           # Componente principal
  │   └── index.js         # Ponto de entrada
  ├── package.json         # Dependências e scripts
  └── README.md            # Este arquivo
``` 