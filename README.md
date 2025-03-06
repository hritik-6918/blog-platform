# Blog Platform

A multi-service blog platform built with Docker containers and deployed on AWS. This project demonstrates skills in containerization, service orchestration, backend development, and cloud deployment. The platform consists of three main services—User Service, Blog Service, and Comment Service—backed by a PostgreSQL database.

## Project Overview

The blog platform includes the following services:

1. **User Service**: Manages user authentication and profiles using JWT and bcrypt for secure password hashing.
2. **Blog Service**: Handles blog post creation, retrieval, and management with pagination support.
3. **Comment Service**: Manages flat comments for blog posts with potential for future nesting.
4. **Database Service**: PostgreSQL with separate schemas for each service to ensure separation of concerns.

### Technologies Used

- **Backend**: Node.js, Express, Sequelize
- **Authentication**: JWT, bcrypt
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Deployment**: AWS EC2

## Prerequisites

- Docker and Docker Compose installed locally
- Node.js and npm (for development)
- AWS account with access to EC2
- Basic understanding of REST APIs and containerization

## Project Structure

```
blog-platform/
├── user-service/         # User authentication and profile management
├── blog-service/         # Blog post management
├── comment-service/      # Comment management
├── db-init/              # Database initialization scripts
├── docker-compose.yml    # Service orchestration
├── .env                  # Environment variables
└── README.md             # Project documentation
```

## Setup Instructions

### Local Development

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd blog-platform
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory with the following content:

   ```
   DB_NAME=blog_platform
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   JWT_SECRET=yourjwtsecret
   ```

3. **Build and Run with Docker Compose**

   ```bash
   docker-compose up --build
   ```

   - User Service: `http://localhost:8001`
   - Blog Service: `http://localhost:8002`
   - Comment Service: `http://localhost:8003`

4. **Test the Endpoints**
   Use tools like Postman or curl to interact with the API (see API Documentation below).

5. **Stop the Application**
   ```bash
   docker-compose down
   ```
   To remove volumes: `docker-compose down -v`

### AWS Deployment

1. **Launch an EC2 Instance**

   - Use Ubuntu 20.04, t2.micro (free tier eligible).
   - Configure security group to allow inbound TCP traffic on ports 8001, 8002, 8003, and 22 (SSH).

2. **Install Docker and Docker Compose on EC2**
   SSH into the instance and run:

   ```bash
   sudo apt update
   sudo apt install docker.io -y
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   sudo usermod -aG docker $USER
   ```

   Log out and back in to apply group changes.

3. **Deploy the Application**

   - Upload the project files to EC2 (e.g., via SCP or Git):
     ```bash
     scp -r blog-platform/ ubuntu@<ec2-public-ip>:~/
     ```
   - SSH into the instance:
     ```bash
     ssh ubuntu@<ec2-public-ip>
     cd ~/blog-platform
     ```
   - Create `.env` with the same variables as local setup.
   - Build and run:
     ```bash
     docker-compose up -d --build
     ```

4. **Access the Application**
   Use the EC2 public IP:

   - User Service: `http://<ec2-public-ip>:8001`
   - Blog Service: `http://<ec2-public-ip>:8002`
   - Comment Service: `http://<ec2-public-ip>:8003`

5. **Stop the Application**
   ```bash
   docker-compose down
   ```

## API Documentation

### User Service (`http://<host>:8001/users`)

- **POST /register/**

  - **Description**: Register a new user.
  - **Body**: `{ "username": "string", "email": "string", "password": "string" }`
  - **Response**: `201 - { "token": "jwt_token" }`
  - **Error**: `400 - { "message": "User already exists" }`

- **POST /login/**

  - **Description**: Authenticate a user and return a JWT.
  - **Body**: `{ "email": "string", "password": "string" }`
  - **Response**: `200 - { "token": "jwt_token" }`
  - **Error**: `400 - { "message": "Invalid credentials" }`

- **GET /<id>**

  - **Description**: Retrieve user details.
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Response**: `200 - { "id": int, "username": "string", "email": "string", "created_at": "date", "updated_at": "date" }`
  - **Error**: `404 - { "message": "User not found" }`

- **PUT /<id>**

  - **Description**: Update user details.
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: `{ "username": "string", "email": "string", "password": "string" }`
  - **Response**: `200 - Updated user object`
  - **Error**: `404 - { "message": "User not found" }`

- **DELETE /<id>**
  - **Description**: Delete a user.
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Response**: `200 - { "message": "User deleted" }`
  - **Error**: `404 - { "message": "User not found" }`

### Blog Service (`http://<host>:8002/blogs`)

- **POST /**

  - **Description**: Create a new blog post.
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: `{ "title": "string", "content": "string" }`
  - **Response**: `201 - Created blog object`
  - **Error**: `500 - { "message": "error message" }`

- **GET /**

  - **Description**: List all blog posts with pagination.
  - **Query**: `page=int&limit=int` (default: page=1, limit=10)
  - **Response**: `200 - { "total": int, "pages": int, "currentPage": int, "data": [blog_objects] }`

- **GET /<id>**

  - **Description**: Fetch a specific blog post.
  - **Response**: `200 - Blog object`
  - **Error**: `404 - { "message": "Blog not found" }`

- **PUT /<id>**

  - **Description**: Edit a blog post (author only).
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: `{ "title": "string", "content": "string" }`
  - **Response**: `200 - Updated blog object`
  - **Error**: `403 - { "message": "Unauthorized" }`, `404 - { "message": "Blog not found" }`

- **DELETE /<id>**
  - **Description**: Delete a blog post (author only).
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Response**: `200 - { "message": "Blog deleted" }`
  - **Error**: `403 - { "message": "Unauthorized" }`, `404 - { "message": "Blog not found" }`

### Comment Service (`http://<host>:8003/comments`)

- **POST /**

  - **Description**: Add a comment to a blog post.
  - **Headers**: `Authorization: Bearer <jwt_token>`
  - **Body**: `{ "content": "string", "blog_id": int }`
  - **Response**: `201 - Created comment object`
  - **Error**: `500 - { "message": "error message" }`

- **GET /**
  - **Description**: List comments for a blog post.
  - **Query**: `post_id=int` (required)
  - **Response**: `200 - [comment_objects]`
  - **Error**: `400 - { "message": "post_id is required" }`

## Design Decisions and Trade-offs

- **Separate Schemas**: Each service uses its own PostgreSQL schema for data isolation within a single database instance. This reduces complexity but may not scale as well as separate databases.
- **JWT Authentication**: Chosen for stateless, scalable authentication. Middleware is duplicated across services for simplicity; in production, a shared library or API gateway would be better.
- **Pagination**: Offset-based pagination is implemented for simplicity. For large datasets, cursor-based pagination would be more efficient.
- **Comments**: Flat structure with a `parent_id` field for future nesting support, balancing simplicity and extensibility.
- **Docker Compose**: Used for local development and simple AWS deployment. In a production environment, Kubernetes or ECS would offer better orchestration and scalability.
- **Database**: Running PostgreSQL in a container simplifies setup but lacks the reliability of AWS RDS in production.

## Troubleshooting

- **Database Connection Errors**: Ensure `.env` variables match the database configuration and that the `db` service is running.
- **Port Conflicts**: Verify ports 8001-8003 are free locally or adjust in `docker-compose.yml`.
- **AWS Access Issues**: Check security group rules and EC2 public IP.

## Future Improvements

- Add API gateway (e.g., Nginx or AWS API Gateway) for routing and load balancing.
- Implement Redis for caching frequently accessed data.
- Use AWS RDS for managed PostgreSQL with backups and scaling.
- Add input validation with libraries like Joi or express-validator.
- Support nested comments with recursive queries or a tree structure.
