## Database Tables 

### user_type

| Column | Type    | Constraints |
|--------|---------|-------------|
| id     | INT     | PRIMARY KEY |
| user_type   | VARCHAR | NOT NULL    |

### user_status
'active', 'in-active'

| Column | Type    | Constraints |
|--------|---------|-------------|
| id | INT | PRIMARY KEY |
| user_status | VARCHAR | NOT NULL |

### user

| Column   | Type    | Constraints                       |
|----------|---------|-----------------------------------|
| id       | INT     | PRIMARY KEY                       |
| name     | VARCHAR | NOT NULL                          |
| email    | VARCHAR | UNIQUE NOT NULL                   |
| phone    | VARCHAR | NOT NULL                          |
| username | VARCHAR | UNIQUE NOT NULL                   |
| password | VARCHAR | NOT NULL                          |
| user_status_cd   | INT    | FOREIGN KEY REFERENCES user_status(id)     |
| user_type_cd     | INT     | FOREIGN KEY REFERENCES user_type(id)|

### category

| Column   | Type    | Constraints |
|----------|---------|-------------|
| id       | INT     | PRIMARY KEY |
| category | VARCHAR | NOT NULL    |
| desc     | TEXT    |             |

### product

| Column     | Type    | Constraints                               |
|------------|---------|-------------------------------------------|
| id         | INT     | PRIMARY KEY                               |
| name       | VARCHAR | NOT NULL                                  |
| img        | VARCHAR | NOT NULL                                  |
| desc       | TEXT    |                                           |
| price      | DECIMAL | (10,2) NOT NULL                            |
| category_id | INT     | FOREIGN KEY REFERENCES category(id)       |
| quantity | INT | NOT NULL |


### orderStatus

| Column | Type    | Constraints |
|--------|---------|-------------|
| id     | INT     | PRIMARY KEY |
| status | VARCHAR | NOT NULL    |

### order

| Column      | Type | Constraints                                      |
|-------------|------|--------------------------------------------------|
| id          | INT  | PRIMARY KEY                                      |
| user_id      | INT  | FOREIGN KEY REFERENCES user(id)                   |
| order_status_cd | INT  | FOREIGN KEY REFERENCES orderStatus(id)            |

### productOrder

| Column    | Type | Constraints                                         |
|-----------|------|-----------------------------------------------------|
| id        | INT  | PRIMARY KEY                                         |
| order_id   | INT  | FOREIGN KEY REFERENCES order(id)                     |
| product_id | INT  | FOREIGN KEY REFERENCES product(id)                   |
| quantity  | INT  | NOT NULL                                            |

### SQL Statement

```SQL
CREATE TABLE user_type (
    id INT PRIMARY KEY,
    user_type VARCHAR(50) NOT NULL
);

CREATE TABLE user_status (
    id INT PRIMARY KEY,
    user_status VARCHAR(50) NOT NULL
);

CREATE TABLE user (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    user_status_cd INT,
    user_type_cd INT,
    FOREIGN KEY (user_status_cd) REFERENCES user_status(id),
    FOREIGN KEY (user_type_cd) REFERENCES user_type(id)
);

CREATE TABLE category (
    id INT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(1000)
);

CREATE TABLE product (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    img VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE order_status (
    id INT PRIMARY KEY,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE `order` (
    id INT PRIMARY KEY,
    user_id INT,
    order_status_cd INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (order_status_cd) REFERENCES order_status(id)
);

CREATE TABLE product_order (
    id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES order(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);