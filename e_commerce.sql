-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2023 at 11:54 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e_commerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category`, `description`) VALUES
(13, 'Smartphones', 'Stay connected with the latest smartphones featuring powerful processors, high-quality cameras, and cutting-edge features. Whether you prefer iOS or Android, we offer a wide selection of devices to fit your needs and budget.'),
(14, 'Laptops', 'Take your work and entertainment on-the-go with our selection of laptops. From lightweight ultrabooks to powerful gaming machines, we have the perfect laptop for every use case. Choose from leading brands such as Apple, Dell, HP, and more.'),
(15, 'TVs', 'Take your work and entertainment on-the-go with our selection of laptops. From lightweight ultrabooks to powerful gaming machines, we have the perfect laptop for every use case. Choose from leading brands such as Apple, Dell, HP, and more.'),
(16, 'Shirts', 'Elevate your formal wardrobe with our collection of stylish dress shirts. Made from high-quality fabrics, our shirts are designed to fit perfectly and make you look and feel confident. Choose from a variety of styles and colors to suit any occasion.'),
(17, 'T-Shirts', 'Stay comfortable and casual with our collection of t-shirts. From basic crew necks to trendy graphic tees, we offer a wide variety of options to fit your style. Our t-shirts are made from soft, breathable fabrics that will keep you comfortable all day long.'),
(18, 'Pants', 'Stay comfortable and stylish with our collection of pants. From classic dress pants to casual chinos, we offer a variety of styles to fit any occasion. Our pants are made from high-quality fabrics and designed to fit perfectly.'),
(19, 'Jackets', 'Stay warm and fashionable with our collection of jackets. From lightweight windbreakers to cozy parkas, we offer a variety of options to keep you comfortable in any weather. Choose from leading brands like North Face, Columbia, and Patagonia.'),
(20, 'Suits', 'Make a statement with our collection of stylish suits. Whether you\'re attending a wedding or a business meeting, our suits are designed to make you look and feel confident. Choose from a variety of styles, colors, and fits to suit any occasion. Our suits are made from high-quality fabrics and tailored to fit perfectly.');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_status_cd` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `order_status`
--

CREATE TABLE `order_status` (
  `id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_status`
--

INSERT INTO `order_status` (`id`, `status`) VALUES
(1, 'accepted'),
(2, 'declined'),
(3, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `image`, `description`, `price`, `category_id`, `quantity`) VALUES
(8, 'Samsung Galaxy S21 Ultra 5G', '1683578689758.jpeg', '6.8 inch, 12GB RAM, 256GB storage, Quad Camera', '1199.00', 13, 50),
(9, 'Apple iPhone 12 Pro Max', '1683578736303.jpeg', '6.7 inch, 6GB RAM, 256GB storage, Triple Camera', '1099.00', 13, 60),
(10, 'Google Pixel 5', '1683578787055.jpeg', '6 inch, 8GB RAM, 128GB storage, Dual Camera', '699.00', 13, 100),
(11, 'OnePlus 9 Pro', '1683578830905.jpeg', '6.7 inch, 12GB RAM, 256GB storage, Quad Camera', '969.00', 13, 70),
(12, 'Xiaomi Mi 11', '1683578870941.jpeg', '6.81 inch, 8GB RAM, 256GB storage, Triple Camera', '799.00', 13, 75),
(13, 'Oppo Find X3 Pro', '1683578924524.jpeg', '6.7 inch, 12GB RAM, 256GB storage, Quad Camera', '1199.00', 13, 80),
(14, 'Apple MacBook Pro', '1683579039199.png', 'Apple M1 chip, 13.3-inch Retina display, 8GB RAM, 512GB SSD, Touch Bar and Touch ID', '1499.00', 14, 200),
(15, 'Dell XPS 13', '1683579095381.jpg', '11th Gen Intel Core i7 processor, 13.4-inch FHD+ InfinityEdge display, 16GB RAM, 512GB SSD', '1599.00', 14, 150),
(16, 'HP Spectre x360', '1683579138024.png', '11th Gen Intel Core i7 processor, 14-inch 4K OLED display, 16GB RAM, 1TB SSD, 2-in-1 design with 360-degree hinge', '1899.00', 14, 100),
(17, 'Samsung QLED 4K TV', '1683579280758.jpg', '55-inch QLED 4K UHD display, Quantum Processor 4K, HDR, Smart TV with built-in Alexa and Google Assistant', '1099.00', 15, 300),
(18, 'LG OLED TV', '1683579338730.jpeg', '65-inch OLED 4K UHD display, α9 Gen 4 AI Processor 4K, HDR, Smart TV with built-in Alexa and Google Assistant', '1799.00', 15, 200),
(19, 'Sony Bravia LED TV', '1683579808843.jpg', '75-inch LED 4K UHD display, X1 Ultimate Processor, HDR, Smart TV with built-in Alexa and Google Assistant', '2299.00', 15, 100),
(20, 'Button-Down Shirt with Floral Print', '1683580849179.jpeg', 'Stay on-trend with this stylish button-down shirt featuring a vibrant floral print. Made from high-quality fabric, this shirt is comfortable and durable, perfect for any occasion.', '49.00', 16, 500),
(21, 'Polo Shirt with Embroidered Logo ', '1683580931331.jpg', 'Look effortlessly stylish with this classic polo shirt featuring an embroidered logo. Made from soft, breathable fabric, this shirt is perfect for both casual and formal occasions.', '39.00', 16, 800),
(22, 'Henley Shirt with Waffle Knit', '1683580992297.jpeg', 'Stay comfortable and stylish with this cozy henley shirt featuring a waffle-knit texture. Made from high-quality fabric, this shirt is perfect for layering or wearing on its own.', '29.00', 16, 1000),
(23, 'Graphic Tee with Retro Print', '1683581051905.jpeg', 'Make a statement with this retro-inspired graphic tee featuring a bold print. Made from soft, lightweight fabric, this tee is comfortable and perfect for casual occasions.', '29.00', 17, 1000),
(24, 'Basic Crewneck Tee', '1683581100952.jpeg', 'Stay comfortable and casual with this basic crewneck tee. Made from soft, breathable fabric, this tee is perfect for everyday wear.', '19.00', 17, 1200),
(25, 'V-Neck Tee with Pocket', '1683581141474.jpeg', 'Upgrade your casual wardrobe with this stylish v-neck tee featuring a convenient pocket. Made from high-quality fabric, this tee is both comfortable and durable.', '24.00', 17, 800),
(26, 'Chinos with Slim Fit', '1683581214893.jpeg', 'Look sleek and sophisticated with these chinos featuring a slim fit. Made from high-quality fabric, these pants are both comfortable and durable, perfect for both formal and casual occasions.', '59.00', 18, 400),
(27, 'Joggers with Tapered Leg', '1683581310265.jpeg', 'Stay comfortable and on-trend with these joggers featuring a tapered leg. Made from soft, breathable fabric, these pants are perfect for both lounging and running errands.', '49.00', 18, 600),
(28, 'Cargo Shorts with Pockets', '1683581471823.jpg', 'Stay cool and stylish with these cargo shorts featuring convenient pockets. Made from high-quality fabric, these shorts are perfect for both casual and outdoor activities.', '39.00', 18, 700),
(29, 'Denim Jacket with Sherpa Collar', '1683582375472.jpg', 'Stay warm and stylish with this classic denim jacket featuring a cozy sherpa collar. Made from high-quality fabric, this jacket is perfect for layering in colder weather.', '89.00', 19, 200),
(30, 'Bomber Jacket with Quilted Lining', '1683582500615.jpg', 'Stay on-trend with this stylish bomber jacket featuring a quilted lining. Made from high-quality fabric, this jacket is both comfortable and durable, perfect for casual occasions.', '79.00', 19, 300),
(31, 'Windbreaker Jacket with Hood', '1683582555909.jpeg', 'Stay protected from the elements with this lightweight windbreaker jacket featuring a hood. Made from high-quality fabric, this jacket is perfect for outdoor activities and sports.', '69.00', 19, 400),
(32, 'Two-Piece Suit with Slim Fit', '1683582710842.jpeg', 'Make a statement with this sleek two-piece suit featuring a slim fit. Made from high-quality fabric, this suit is perfect for formal occasions and business meetings.', '299.00', 20, 150),
(33, 'Three-Piece Suit with Vest', '1683582753851.jpeg', 'Look sharp and sophisticated with this three-piece suit featuring a vest. Made from high-quality fabric, this suit is perfect for weddings, proms, and other formal occasions.', '399.00', 20, 100),
(34, 'Tuxedo with Satin Lapels', '1683582801514.jpg', 'Make a lasting impression with this elegant tuxedo featuring satin lapels. Made from high-quality fabric, this tuxedo is', '499.00', 20, 50);

-- --------------------------------------------------------

--
-- Table structure for table `product_order`
--

CREATE TABLE `product_order` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `user_status_cd` int(11) DEFAULT NULL,
  `user_type_cd` int(11) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `phone`, `username`, `password`, `user_status_cd`, `user_type_cd`, `token`) VALUES
(0, 'admin', 'admin@admin.com', '000000000000', 'admin', '$2b$10$P4wF2wULIg2G7sy1B7ylUO5Xx6.6yDs/7Ijpv9cJdZfoG0KKhrYcu', 1, 1, '5e6342178e3111a054f410f85ab1af71'),
(13, 'kirollos Rafik', 'kirollos2@yahoo.com', '010000000000', 'kiro', '$2b$10$aCh6S3aEQjr.2uNLY3PUBeMt/RkMxHC.2gMbU3rQuXxNlGCz73VZu', 1, 0, '670e667bca3ab4b594d7c6538f32bef8');

-- --------------------------------------------------------

--
-- Table structure for table `user_status`
--

CREATE TABLE `user_status` (
  `id` int(11) NOT NULL,
  `user_status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_status`
--

INSERT INTO `user_status` (`id`, `user_status`) VALUES
(1, 'active'),
(2, 'in-active');

-- --------------------------------------------------------

--
-- Table structure for table `user_type`
--

CREATE TABLE `user_type` (
  `id` int(11) NOT NULL,
  `user_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_type`
--

INSERT INTO `user_type` (`id`, `user_type`) VALUES
(0, 'buyer'),
(1, 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_ibfk_1` (`user_id`),
  ADD KEY `order_ibfk_2` (`order_status_cd`);

--
-- Indexes for table `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_ibfk_1` (`category_id`);

--
-- Indexes for table `product_order`
--
ALTER TABLE `product_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_order_ibfk_1` (`order_id`),
  ADD KEY `product_order_ibfk_2` (`product_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `user_ibfk_1` (`user_status_cd`),
  ADD KEY `user_ibfk_2` (`user_type_cd`);

--
-- Indexes for table `user_status`
--
ALTER TABLE `user_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_type`
--
ALTER TABLE `user_type`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_status`
--
ALTER TABLE `order_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `product_order`
--
ALTER TABLE `product_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user_status`
--
ALTER TABLE `user_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_type`
--
ALTER TABLE `user_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`order_status_cd`) REFERENCES `order_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_order`
--
ALTER TABLE `product_order`
  ADD CONSTRAINT `product_order_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_order_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`user_status_cd`) REFERENCES `user_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`user_type_cd`) REFERENCES `user_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
