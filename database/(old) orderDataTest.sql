CREATE TABLE Admins
(
    admin_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    role VARCHAR(20) NOT NULL CHECK (role IN ('SuperAdmin', 'Moderator')),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- Insert sample data into Admins table
INSERT INTO Admins
    (username, password, full_name, email, phone_number, role)
VALUES
    ('admin', 'adminpassword', 'Super Admin', 'admin@example.com', '1231231234', 'SuperAdmin'),
    ('moderator', 'modpassword', 'Site Moderator', 'mod@example.com', '3213214321', 'Moderator');
GO



CREATE TABLE PCs
(
    pc_id INT PRIMARY KEY IDENTITY(1,1),
    pc_name VARCHAR(50) NOT NULL,
    ip_address VARCHAR(15) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Available', 'In Use', 'Under Maintenance')),
    purchase_date DATE,
    specification VARCHAR(MAX)
);
GO

-- Insert sample data into PCs table
INSERT INTO PCs
    (pc_name, ip_address, status, purchase_date, specification)
VALUES
    ('Alienware Aurora', '192.168.1.10', 'Available', '2023-02-15', 'Intel i9, 32GB RAM, Nvidia RTX 3080'),
    ('Asus ROG Strix', '192.168.1.11', 'In Use', '2022-10-05', 'AMD Ryzen 9, 16GB RAM, Nvidia GTX 1660'),
    ('HP Omen', '192.168.1.12', 'Under Maintenance', '2021-08-20', 'Intel i7, 16GB RAM, Nvidia GTX 1080');
GO



CREATE TABLE Customers
(
    customer_id INT PRIMARY KEY IDENTITY(1,1),
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    email VARCHAR(100),
    is_vip VARCHAR(3) NOT NULL DEFAULT 'No' CHECK (is_vip IN ('Yes', 'No')),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- Insert sample data into Customers table
INSERT INTO Customers
    (full_name, username, password, phone_number, email, is_vip)
VALUES
    ('John Doe', 'johndoe', 'password123', '1234567890', 'johndoe@example.com', 'Yes'),
    ('Jane Smith', 'janesmith', 'password123', '0987654321', 'janesmith@example.com', 'No'),
    ('Alice Johnson', 'alicej', 'password123', '5551234567', 'alicej@example.com', 'Yes');
GO



CREATE TABLE Games
(
    game_id INT PRIMARY KEY IDENTITY(1,1),
    game_name VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    developer VARCHAR(100),
    release_year INT,
    created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (created_by) REFERENCES Admins(admin_id),
    FOREIGN KEY (updated_by) REFERENCES Admins(admin_id)
);
GO

-- Insert sample data into Games table
INSERT INTO Games
    (game_name, genre, developer, release_year, created_by, updated_by)
VALUES
    ('Cyberpunk 2077', 'RPG', 'CD Projekt', 2020, 1, NULL),
    ('Minecraft', 'Sandbox', 'Mojang', 2009, 1, NULL),
    ('Fortnite', 'Battle Royale', 'Epic Games', 2017, 1, NULL);
GO



CREATE TABLE Payments
(
    payment_id INT PRIMARY KEY IDENTITY(1,1),
    customer_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE(),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('Cash', 'Credit Card', 'E-wallet')),
    admin_id INT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id)
);
GO

-- Insert sample data into Payments table
INSERT INTO Payments
    (customer_id, amount, payment_date, payment_method, admin_id)
VALUES
    (1, 500000, '2024-12-13 10:30:00', 'Credit Card', 1),
    (2, 150000, '2024-12-12 14:15:00', 'Cash', 2);
GO



CREATE TABLE GameSessions
(
    session_id INT PRIMARY KEY IDENTITY(1,1),
    customer_id INT NOT NULL,
    game_id INT NOT NULL,
    pc_id INT NOT NULL,
    session_start_time DATETIME NOT NULL,
    session_end_time DATETIME,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (game_id) REFERENCES Games(game_id),
    FOREIGN KEY (pc_id) REFERENCES PCs(pc_id)
);
GO

-- Insert sample data into GameSessions table
INSERT INTO GameSessions
    (customer_id, game_id, pc_id, session_start_time, session_end_time)
VALUES
    (1, 2, 3, '2024-12-13 11:00:00', '2024-12-13 13:00:00');
GO



CREATE TABLE Companions
(
    companion_id INT PRIMARY KEY IDENTITY(1,1),
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    available VARCHAR(3) NOT NULL DEFAULT 'Yes' CHECK (available IN ('Yes', 'No')),
    hourly_rate DECIMAL(10, 2) NOT NULL,
    description VARCHAR(MAX)
);
GO

-- Insert sample data into Companions table
INSERT INTO Companions
    (full_name, age, available, hourly_rate, description)
VALUES
    ('Anna Nguyen', 25, 'Yes', 50000, 'A professional and friendly companion with expertise in gaming.');
GO



CREATE TABLE VIPServices
(
    service_id INT PRIMARY KEY IDENTITY(1,1),
    service_name VARCHAR(100) NOT NULL,
    description VARCHAR(MAX),
    price DECIMAL(10, 2) NOT NULL
);
GO

-- Insert sample data into VIPServices table
INSERT INTO VIPServices
    (service_name, description, price)
VALUES
    ('Companion Play', 'Hire a female companion to play games with you', 50000),
    ('Private Room', 'Exclusive gaming room with premium features', 200000);
GO



CREATE TABLE Bookings
(
    booking_id INT PRIMARY KEY IDENTITY(1,1),
    customer_id INT NOT NULL,
    pc_id INT NOT NULL,
    booking_start_time DATETIME NOT NULL,
    booking_end_time DATETIME NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    service_id INT NULL,
    companion_id INT NULL,
    admin_id INT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (pc_id) REFERENCES PCs(pc_id),
    FOREIGN KEY (service_id) REFERENCES VIPServices(service_id),
    FOREIGN KEY (companion_id) REFERENCES Companions(companion_id),
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id)
);
GO

-- Insert sample data into Bookings table
INSERT INTO Bookings
    (customer_id, pc_id, booking_start_time, booking_end_time, total_price, service_id, companion_id, admin_id)
VALUES
    (1, 3, '2024-12-13 11:00:00', '2024-12-13 13:00:00', 150000, 1, 1, 1);
GO

CREATE TABLE Drinks
(
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
GO



-- Insert sample data into Drinks table
INSERT INTO Drinks
    (name, price)
VALUES
    ('Water', 5000),
    ('Sting Red', 15000),
    ('Sting Yellow', 15000),
    ('Redbull', 20000),
    ('7-up', 15000),
    ('Milk', 20000),
    ('ChocoLEAN', 30000),
    ('Goat Kefir S', 100000),
    ('Mans Milk', 500000);
GO


CREATE TABLE Foods
(
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
GO



-- Insert sample data into Foods table
INSERT INTO Foods
    (name, price)
VALUES
    ('Rice', 5000),
    ('Fried Rice', 20000),
    ('Rice with chicken', 30000),
    ('Rice with beef', 30000),
    ('Noodle', 10000),
    ('Noodle with 2 eggs', 20000),
    ('Chicken Noodle', 30000),
    ('Beef Noodle', 30000),
    ('50kg (Oysters)', 5000000);
GO



CREATE TABLE Top_up
(
    id INT PRIMARY KEY IDENTITY(1,1),
    amount DECIMAL(10, 2) DEFAULT NULL,
    custom_amount DECIMAL(10, 2) DEFAULT NULL
);
GO

-- Insert sample data into Top_up table
INSERT INTO Top_up
    (amount, custom_amount)
VALUES
    (10000, NULL),
    (19000, NULL),
    (58000, NULL),
    (117000, NULL),
    (236000, NULL),
    (355000, NULL),
    (500000, NULL),
    (NULL, NULL); -- Reserved for custom input
GO



CREATE TABLE Orders
(
    order_id INT PRIMARY KEY IDENTITY(1,1),
    customer_id INT NOT NULL,
    order_date DATETIME DEFAULT GETDATE(),
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);
GO



CREATE TABLE OrderDetails
(
    detail_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('Food', 'Drink', 'Top-up')),
    item_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_per_item DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);
GO



-- Insert sample orders for 3 customers
INSERT INTO Orders
    (customer_id, total_price)
VALUES
    (1, 75000),
    -- John Doe
    (2, 110000),
    -- Jane Smith
    (3, 135000); -- Alice Johnson
GO



-- Insert random order details for Order 1 (John Doe)
INSERT INTO OrderDetails
    (order_id, item_type, item_id, quantity, price_per_item, total_price)
VALUES
    (1, 'Food', 1, 1, 5000, 5000),
    -- Rice
    (1, 'Drink', 2, 2, 15000, 30000),
    -- Sting Red
    (1, 'Top-up', 1, 1, 10000, 10000);
-- 1 HOUR Top-up

-- Insert random order details for Order 2 (Jane Smith)
INSERT INTO OrderDetails
    (order_id, item_type, item_id, quantity, price_per_item, total_price)
VALUES
    (2, 'Food', 4, 1, 30000, 30000),
    -- Rice with beef
    (2, 'Drink', 6, 2, 20000, 40000),
    -- Milk
    (2, 'Top-up', 3, 1, 58000, 58000);
-- 6 HOURS Top-up

-- Insert random order details for Order 3 (Alice Johnson)
INSERT INTO OrderDetails
    (order_id, item_type, item_id, quantity, price_per_item, total_price)
VALUES
    (3, 'Food', 7, 1, 30000, 30000),
    -- Chicken Noodle
    (3, 'Drink', 9, 1, 500000, 500000),
    -- Man's Milk
    (3, 'Top-up', 4, 1, 117000, 117000); -- 12 HOURS Top-up
GO




SELECT *
FROM Admins;
SELECT *
FROM PCs;
SELECT *
FROM Customers;
SELECT *
FROM Games;
SELECT *
FROM Payments;
SELECT *
FROM GameSessions;
SELECT *
FROM Companions;
SELECT *
FROM VIPServices;
SELECT *
FROM Bookings;
SELECT *
FROM Drinks;
SELECT *
FROM Foods;
SELECT *
FROM Top_up;
SELECT *
FROM Orders;
SELECT *
FROM OrderDetails;

USE CyberGaming;