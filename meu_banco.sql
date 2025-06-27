-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 27/06/2025 às 15:35
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `meu_banco`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluguel`
--

CREATE TABLE `aluguel` (
  `id` bigint(20) NOT NULL,
  `data_aluguel` date DEFAULT NULL,
  `forma_pagamento` enum('CARTAO_CREDITO','CARTAO_DEBITO','DINHEIRO','PIX') DEFAULT NULL,
  `valor_total` double NOT NULL,
  `cliente_id` bigint(20) DEFAULT NULL,
  `funcionario_id` bigint(20) NOT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_termino` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `aluguel`
--

INSERT INTO `aluguel` (`id`, `data_aluguel`, `forma_pagamento`, `valor_total`, `cliente_id`, `funcionario_id`, `data_inicio`, `data_termino`) VALUES
(2, '2025-06-26', 'DINHEIRO', 12, 2, 2, '2024-06-12', '2025-06-12'),
(3, '2025-06-26', 'CARTAO_CREDITO', 36, 1, 3, '2025-06-06', '2025-12-20'),
(4, '2025-06-26', 'DINHEIRO', 480, 4, 3, '2025-03-03', '2026-05-03'),
(5, '2025-06-26', 'DINHEIRO', 12, 5, 2, '2023-03-10', '2026-03-10'),
(6, '2025-06-26', 'CARTAO_DEBITO', 60, 3, 2, '2010-10-10', '2030-10-10');

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluguel_itens_alugados`
--

CREATE TABLE `aluguel_itens_alugados` (
  `aluguel_id` bigint(20) NOT NULL,
  `itens_alugados_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `aluguel_itens_alugados`
--

INSERT INTO `aluguel_itens_alugados` (`aluguel_id`, `itens_alugados_id`) VALUES
(2, 3),
(3, 4),
(4, 5),
(5, 6),
(6, 7);

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `id` bigint(20) NOT NULL,
  `cpf` varchar(255) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `cliente`
--

INSERT INTO `cliente` (`id`, `cpf`, `endereco`, `nome`, `telefone`) VALUES
(1, '12344', 'Rodrig', 'paulos', '323123'),
(2, '1', '4343', 'joaquim', '32323'),
(3, '3214124', '123', 'crebi', '123'),
(4, '2', '4343', 'lols', '232'),
(5, '421421', 'Rua joa', 'junin sem dedo', '321321'),
(6, '2131230', 'Rua J', 'paulo', '2312321');

-- --------------------------------------------------------

--
-- Estrutura para tabela `funcionario`
--

CREATE TABLE `funcionario` (
  `id` bigint(20) NOT NULL,
  `cargo` varchar(255) DEFAULT NULL,
  `cpf` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `funcionario`
--

INSERT INTO `funcionario` (`id`, `cargo`, `cpf`, `nome`, `telefone`) VALUES
(1, 'Gerente', '321321', 'Clebr', '321321'),
(2, 'CHEFAO', '23124124', 'Jucao', '321312321'),
(3, 'Atendente', '12312321312', 'Juju', '329994122');

-- --------------------------------------------------------

--
-- Estrutura para tabela `item_aluguel`
--

CREATE TABLE `item_aluguel` (
  `id` bigint(20) NOT NULL,
  `preco_unitario` double NOT NULL,
  `quantidade` int(11) NOT NULL,
  `produto_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `item_aluguel`
--

INSERT INTO `item_aluguel` (`id`, `preco_unitario`, `quantidade`, `produto_id`) VALUES
(3, 12, 1, 1),
(4, 12, 3, 3),
(5, 40, 12, 4),
(6, 12, 1, 3),
(7, 30, 2, 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `id` bigint(20) NOT NULL,
  `estoque` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `preco` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`id`, `estoque`, `nome`, `preco`) VALUES
(1, 31, 'Pizza', 12),
(2, 0, 'Cachaça', 30),
(3, 996, 'mais cachaça', 12),
(4, 88, 'cachaça premium', 40);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aluguel`
--
ALTER TABLE `aluguel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK748cpvt1o259iu7a4sexhj127` (`cliente_id`),
  ADD KEY `FK4ba961bhv3iaxyhh92sgapo70` (`funcionario_id`);

--
-- Índices de tabela `aluguel_itens_alugados`
--
ALTER TABLE `aluguel_itens_alugados`
  ADD UNIQUE KEY `UKbvneg0k1dsq7f8hqtkdrr6v3u` (`itens_alugados_id`),
  ADD KEY `FKc12y1q8ck028fdxri4po7vvmh` (`aluguel_id`);

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `funcionario`
--
ALTER TABLE `funcionario`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `item_aluguel`
--
ALTER TABLE `item_aluguel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKq3se2j1u4674kasfyumhy6ul5` (`produto_id`);

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `aluguel`
--
ALTER TABLE `aluguel`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `funcionario`
--
ALTER TABLE `funcionario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `item_aluguel`
--
ALTER TABLE `item_aluguel`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `aluguel`
--
ALTER TABLE `aluguel`
  ADD CONSTRAINT `FK4ba961bhv3iaxyhh92sgapo70` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionario` (`id`),
  ADD CONSTRAINT `FK748cpvt1o259iu7a4sexhj127` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`);

--
-- Restrições para tabelas `aluguel_itens_alugados`
--
ALTER TABLE `aluguel_itens_alugados`
  ADD CONSTRAINT `FK4bsqm3wxgcpuvduqvo2rvbkx7` FOREIGN KEY (`itens_alugados_id`) REFERENCES `item_aluguel` (`id`),
  ADD CONSTRAINT `FKc12y1q8ck028fdxri4po7vvmh` FOREIGN KEY (`aluguel_id`) REFERENCES `aluguel` (`id`);

--
-- Restrições para tabelas `item_aluguel`
--
ALTER TABLE `item_aluguel`
  ADD CONSTRAINT `FKq3se2j1u4674kasfyumhy6ul5` FOREIGN KEY (`produto_id`) REFERENCES `produto` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
