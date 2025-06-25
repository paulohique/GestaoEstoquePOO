# Sistema de Gestão de Estoque - Trabalho Final POO

##  Descrição do Projeto

Este é um sistema completo de gestão de estoque desenvolvido como trabalho final da disciplina de Programação Orientada a Objetos (POO). O sistema permite gerenciar produtos, clientes, funcionários, aluguéis e gerar relatórios em PDF.
![image](https://github.com/user-attachments/assets/b3325801-2d09-4964-8a78-4dbf9cfa93bc)


##  Tecnologias Utilizadas

### Backend

- **Java 21**
- **Spring Boot 3.4.4**
- **Spring Data JPA**
- **MySQL** (Banco de dados principal)
- **H2 Database** (Para testes)
- **iText7** (Geração de PDFs)
- **Maven** (Gerenciamento de dependências)


### Frontend

- **Next.js 14**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui** (Componentes)
- **Lucide React** (Ícones)


##  Como Executar o Projeto

### Pré-requisitos

- Java 21 ou superior
- Node.js 18 ou superior
- MySQL 8.0 ou superior
- Git


### 1. Configuração do Banco de Dados

```sql
-- Criar o banco de dados
CREATE DATABASE meu_banco;

-- Configurar usuário (opcional)
CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'senha';
GRANT ALL PRIVILEGES ON meu_banco.* TO 'usuario'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configuração do Backend

```shellscript
# Clonar o repositório
git clone https://github.com/seu-usuario/sistema-gestao-estoque.git
cd sistema-gestao-estoque

# Navegar para a pasta do backend
cd demo

# Configurar o banco no application.properties
# Editar src/main/resources/application.properties com suas credenciais MySQL

# Executar o projeto
./mvnw spring-boot:run

# Ou no Windows
mvnw.cmd spring-boot:run
```

**Configuração do application.properties:**

```plaintext
# Configuração do banco de dados MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/meu_banco?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=sua_senha
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configurações JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Porta do servidor
server.port=8080
```

### 3. Configuração do Frontend

```shellscript
# Em um novo terminal, navegar para a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Executar o projeto
npm run dev
```

##  Estrutura do Projeto

```plaintext
sistema-gestao-estoque/
├── demo/                          # Backend Spring Boot
│   ├── src/main/java/Estoque/Estoque/
│   │   ├── controller/           # Controllers REST
│   │   ├── model/               # Entidades JPA
│   │   ├── repository/          # Repositórios
│   │   ├── service/             # Lógica de negócio
│   │   ├── dto/                 # Data Transfer Objects
│   │   └── config/              # Configurações
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml                  # Dependências Maven
├── frontend/                     # Frontend Next.js
│   ├── app/                     # Páginas Next.js
│   ├── components/              # Componentes React
│   ├── package.json             # Dependências NPM
│   └── tailwind.config.js       # Configuração Tailwind
└── README.md
```

##  Funcionalidades

### 1. Dashboard

- Métricas em tempo real
- Aluguéis recentes
- Produtos com estoque baixo
- Resumo mensal


### 2. Gestão de Clientes

- Cadastro, edição e exclusão
- Busca por nome ou CPF
- Validação de CPF único


### 3. Gestão de Funcionários

- Cadastro completo
- Busca por nome ou cargo
- Controle de acesso


### 4. Gestão de Produtos

- Controle de estoque
- Alertas de estoque baixo
- Preços e quantidades


### 5. Sistema de Aluguéis

- Registro com datas de início e término
- Múltiplos produtos por aluguel
- Diferentes formas de pagamento
- Cálculo automático de valores


### 6. Relatórios em PDF

- **Vendas por Mês**: Consolidado mensal
- **Vendas por Cliente**: Histórico detalhado
- **Gestão de Estoque**: Inventário completo


##  Endpoints da API

### Clientes

```plaintext
GET    /clientes           # Listar todos
POST   /clientes           # Criar novo
GET    /clientes/{id}      # Buscar por ID
PUT    /clientes/{id}      # Atualizar
DELETE /clientes/{id}      # Excluir
```

### Funcionários

```plaintext
GET    /funcionarios       # Listar todos
POST   /funcionarios       # Criar novo
GET    /funcionarios/{id}  # Buscar por ID
PUT    /funcionarios/{id}  # Atualizar
DELETE /funcionarios/{id}  # Excluir
```

### Produtos

```plaintext
GET    /produtos           # Listar todos
POST   /produtos           # Criar novo
GET    /produtos/{id}      # Buscar por ID
```

### Aluguéis

```plaintext
GET    /alugueis                    # Listar todos
POST   /alugueis/simples           # Aluguel simples
POST   /alugueis/com-produtos      # Aluguel com produtos
DELETE /alugueis/{id}              # Excluir
```

### Relatórios

```plaintext
GET    /relatorios/vendas-mes/{ano}        # PDF vendas por mês
GET    /relatorios/vendas-cliente/{id}     # PDF vendas por cliente
GET    /relatorios/estoque                 # PDF gestão de estoque
```

##  Exemplos de Uso

### Cadastrar Cliente

```json
POST /clientes
{
  "nome": "João Silva",
  "cpf": "12345678901",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123"
}
```

### Registrar Aluguel

```json
POST /alugueis/com-produtos
{
  "cliente": { "id": 1 },
  "funcionario": { "id": 1 },
  "dataInicio": "2024-01-15",
  "dataTermino": "2024-01-20",
  "formaPagamento": "PIX",
  "itensAlugados": [
    {
      "produto": { "id": 1 },
      "quantidade": 2
    }
  ]
}
```

##  Interface do Sistema

O sistema possui uma interface moderna e responsiva com:

- **Dashboard** com métricas em tempo real
- **Tabelas** interativas com busca e filtros
- **Formulários** intuitivos para cadastros
- **Modais** para edição rápida
- **Alertas** visuais para estoque baixo
- **Download** direto de relatórios PDF


## 🔧 Dependências Principais

### Backend (pom.xml)

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
    </dependency>
    <dependency>
        <groupId>com.itextpdf</groupId>
        <artifactId>itext7-core</artifactId>
        <version>7.2.5</version>
    </dependency>
</dependencies>
```

### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^18",
    "next": "14.0.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.3.0"
  }
}
```

##  Solução de Problemas

### Erro de Conexão com MySQL

```shellscript
# Verificar se o MySQL está rodando
sudo systemctl status mysql

# Iniciar MySQL se necessário
sudo systemctl start mysql
```

### Erro de CORS

O backend já está configurado para aceitar requisições do frontend na porta 3000.

### Porta já em uso

```shellscript
# Backend (porta 8080)
lsof -ti:8080 | xargs kill -9

# Frontend (porta 3000)
lsof -ti:3000 | xargs kill -9
```

##  Conceitos de POO Aplicados

### 1. Encapsulamento

- Atributos privados nas entidades
- Métodos getters e setters
- Validações nos setters


### 2. Herança

- Classe abstrata `Objeto` para produtos
- Hierarquia de entidades


### 3. Polimorfismo

- Interfaces de repositório
- Métodos sobrescritos


### 4. Abstração

- Services para lógica de negócio
- DTOs para transferência de dados
- Interfaces para contratos


##  Autor

Paulo Henrique Ferreira dos Santos

- GitHub: [@paulohique](https://github.com/paulohique)


##  Licença

Este projeto foi desenvolvido para fins acadêmicos como trabalho final da disciplina de Programação Orientada a Objetos.

---

**Trabalho Final - Programação Orientada a Objetos****UNIPAC/CIENCIA DA COMPUTAÇÂO - Ano 2024**
