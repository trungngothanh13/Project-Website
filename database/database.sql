-- Create database
CREATE DATABASE CyberGaming;
GO

-- Use the database
USE CyberGaming;
GO

-- Table for managing gaming PCs
CREATE TABLE PCs
(
    pc_id INT PRIMARY KEY IDENTITY(1,1),
    pc_name VARCHAR(50) NOT NULL,
    ip_address VARCHAR(15) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Available', 'In Use', 'Under Maintenance')),
    purchase_date DATE,
    specification TEXT
);
GO

-- Table for managing customers
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

-- Table for managing games
CREATE TABLE Games
(
    game_id INT PRIMARY KEY IDENTITY(1,1),
    game_name VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    developer VARCHAR(100),
    release_year INT
);
GO




-- Table for managing payments
CREATE TABLE Payments
(
    payment_id INT PRIMARY KEY IDENTITY(1,1),
    customer_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE(),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('Cash', 'Credit Card', 'E-wallet')),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);
GO

-- Table for managing game sessions
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

-- Table for managing companions (female companions)
CREATE TABLE Companions
(
    companion_id INT PRIMARY KEY IDENTITY(1,1),
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    available VARCHAR(3) NOT NULL DEFAULT 'Yes' CHECK (available IN ('Yes', 'No')),
    hourly_rate DECIMAL(10, 2) NOT NULL,
    description TEXT
);
GO

-- Table for managing special VIP services (hiring companions and ordering oysters)
CREATE TABLE VIPServices
(
    service_id INT PRIMARY KEY IDENTITY(1,1),
    service_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
GO

-- Insert predefined services (e.g., Playing Game and Ordering Oysters)
INSERT INTO VIPServices
    (service_name, description, price)
VALUES
    ('Companion Play', 'Hire a female companion to play games with you', 50.00),
    ('Oysters Package', 'Order a plate of fresh oysters to enjoy during your session', 30.00);
GO

-- Table for managing VIP bookings (track when customers book a companion or service)
CREATE TABLE VIPBookings
(
    vip_booking_id INT PRIMARY KEY IDENTITY(1,1),
    customer_id INT NOT NULL,
    companion_id INT NULL,
    service_id INT NULL,
    booking_start_time DATETIME NOT NULL,
    booking_end_time DATETIME,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (companion_id) REFERENCES Companions(companion_id),
    FOREIGN KEY (service_id) REFERENCES VIPServices(service_id)
);
GO

-- Table for managing bookings
CREATE TABLE Bookings
(
    booking_id INT PRIMARY KEY IDENTITY(1,1),
    customer_id INT NOT NULL,
    pc_id INT NOT NULL,
    booking_start_time DATETIME NOT NULL,
    booking_end_time DATETIME NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    vip_booking_id INT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (pc_id) REFERENCES PCs(pc_id),
    FOREIGN KEY (vip_booking_id) REFERENCES VIPBookings(vip_booking_id)
);
GO

-- Table for managing admin users
CREATE TABLE Admins
(
    admin_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    -- Password should be securely hashed
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    role VARCHAR(20) NOT NULL CHECK (role IN ('SuperAdmin', 'Moderator')),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- Alter the Bookings table to include admin_id for tracking who managed the booking
ALTER TABLE Bookings
ADD admin_id INT NULL,
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id);
GO

-- Add created_by and updated_by fields in Customers table to track the admin responsible
ALTER TABLE Customers
ADD created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (created_by) REFERENCES Admins(admin_id),
    FOREIGN KEY (updated_by) REFERENCES Admins(admin_id);
GO

-- Alter the VIPBookings table to include admin_id for tracking who managed the VIP booking
ALTER TABLE VIPBookings
ADD admin_id INT NULL,
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id);
GO

-- Add created_by and updated_by fields in PCs table to track the admin responsible
ALTER TABLE PCs
ADD created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (created_by) REFERENCES Admins(admin_id),
    FOREIGN KEY (updated_by) REFERENCES Admins(admin_id);
GO

-- Add created_by and updated_by fields in Games table to track the admin responsible
ALTER TABLE Games
ADD created_by INT NULL,
    updated_by INT NULL,
    FOREIGN KEY (created_by) REFERENCES Admins(admin_id),
    FOREIGN KEY (updated_by) REFERENCES Admins(admin_id);
GO

-- Alter the Payments table to include admin_id for tracking who handled the payment
ALTER TABLE Payments
ADD admin_id INT NULL,
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id);
GO




