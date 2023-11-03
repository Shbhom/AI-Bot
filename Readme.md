# AI Customer Service Chat Bot

Welcome to the AI Customer Service Chat Bot project! This project is built using TypeScript, Express, PostgreSQL, Pinecone, Langchain, and Docker. It provides a foundation for creating a chatbot capable of handling customer service inquiries using AI technology.

## Prerequisites

Before you can start working on this project, make sure you have the following tools and dependencies installed on your system:

- [Node.js](https://nodejs.org/) (recommended version 14+)
- [Docker](https://www.docker.com/)
- [PNPM](https://pnpm.io/) (or you can use npm)

## Setup

Follow these steps to set up the project for development:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Shbhom/AI-Bot.git
   ```

2. Navigate to the project directory:
   ```bash
   cd AI-Bot/server
   ```

3. Install project dependencies using PNPM (if you don't have PNPM installed, you can install it globally using `npm`):
   ```bash
   pnpm install
   ```

4. Set up environment variables:
   Create an `.env` file based on the provided `env-example` file and update it with the required environment variables for your project.

5. Start a PostgreSQL database in a Docker container with the following command:
   ```bash
   docker run -d --rm -p 5432:5432 -v ./data:/var/lib/postgresql/data -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -e POSTGRES_DB=customerbot --name customerbot postgres
   ```

   This command creates a PostgreSQL database container named `customerbot`. The data is persisted in the `./data` directory.

6. When you're done working with the database, you can stop the Docker container:
   ```bash
   docker stop customerbot
   ```

7. To start the PostgreSQL command-line tool (PSQL) for the `customerbot` database, run the following command:
   ```bash
   docker exec -it customerbot psql -U root -d customerbot
   ```

   You'll be logged into your database.

8. Start the development server using PNPM:
   ```bash
   pnpm dev
   ```

   The server should now be running and accessible for further development.
