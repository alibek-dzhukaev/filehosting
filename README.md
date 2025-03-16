# File Hosting Server
#### _A file hosting server built with Node.js, TypeORM, and PostgreSQL, designed to run in a Docker container. This application allows users to upload, download, and manage files securely._

## Features
- File Upload: Upload files to the server.

- File Download: Download files by their unique ID.

- File Management: List, update, and delete files.

- Authentication: Secure endpoints with JWT-based authentication.

- Database Integration: Uses PostgreSQL for storing file metadata and user information.

- Docker Support: Easily run the application in a Docker container.

## Technologies
- Runtime: Node.js

- Package Manager: pnpm

- Database: PostgreSQL

- ORM: TypeORM

- Containerization: Docker

- API Documentation: Swagger

## Prerequisites
Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)

- pnpm (v8 or higher)

- Docker (v20 or higher)

- Docker Compose (v2 or higher)


# Setup
## Local Development
1) Clone the repository:

```bash
git clone https://github.com/alibekdzhukaev/filehosting.git
cd file-hosting-server
```
2) Install dependencies:
```bash
pnpm install
```
3) Set up environment variables:

```bash
cp .env.example .env.development
```

4) Build Docker Compose
```bash
docker-compose build
```


5Run Docker Compose
```bash
docker-compose up -d
```

6) Run migrations:
```bash
pnpm run migration:run
```

7) Access the application:

#### The server will be running at http://localhost:3000.