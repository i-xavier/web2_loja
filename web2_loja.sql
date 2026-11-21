CREATE DATABASE IF NOT EXISTS web2_loja;
USE web2_loja;

CREATE TABLE produto ( 
  id INT AUTO_INCREMENT PRIMARY KEY, 
  nome VARCHAR(100) NOT NULL, 
  preco DECIMAL(10, 2) NOT NULL CHECK (preco >= 0), 
  estoque INT NOT NULL DEFAULT 0 
);
  
INSERT INTO produto (nome, preco, estoque) 
VALUES 
  ('Teclado USB', 89.90, 15), 
  ('Mouse sem fio', 59.90, 30), 
  ('Caderno 10 mat.', 24.50, 50), 
  ('Caneta azul', 2.30, 200);

CREATE TABLE categoria ( 
  id INT AUTO_INCREMENT PRIMARY KEY, 
  nome VARCHAR(100) NOT NULL
);