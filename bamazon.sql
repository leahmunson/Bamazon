DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name TEXT NOT NULL,
    department_name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, depeartment_name, price, stock_quantity) VALUES 
('Lamb Dog Toy', 'Pets', 5.99, 45),
('Apple Watch Series 5 40mm', 'Electronics', 399.99, 234),
('Beats Pill Speaker', 'Electronics', 109.99, 32),
('Kate Spade Dish Towel', 'Kitchen', 23.99, 81),
('Small Frying Pan', 'Kitchen', 27.99, 127),
('Large Decorative Pillow', 'Home', 15.99, 95),
('Wall Clock', 'Home', 38.99, 345),
('Unisex Black Pullover', 'Bamazon Fashion', 19.99, 61),
('Addidas Socks 3 Pack', 'Bamazon Fashion', 115.99, 30),
('Pantene Shampoo', 'Bath', 8.99, 82)

