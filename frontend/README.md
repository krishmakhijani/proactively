# Proactively - Assignment

## Preview

![Frontend](https://github.com/user-attachments/assets/60d49ed4-80f2-4de5-a952-f225b656ecfd)

![Frontend](https://github.com/user-attachments/assets/df9035c9-86ba-46af-9755-dd1d1672ad7f)




> [!WARNING]
> Made ```.env``` files public for the convenience of the reviewer. This is not recommended in a production environment.

## Tech Stack

### Backend
- Node.js
- Express
- Prisma
- TypeScript
- PostgreSQL (Database)

### Frontend
- Next.js
- React
- Tailwind CSS


### Prerequisites
- Node.js (v14 or higher)
- npm (v7 or higher)
- pnpm (v6 or higher)(recommended)

### Installation Steps

1. Clone the repository:
    ```sh
    git clone https://github.com/krishmakhijani/proactively.git
    cd proactively
    ```

2. Install Backend Dependencies
    ```sh
    cd backend
    npm install
    npx prisma generate
    ```

3. Install Frontend Dependencies
    ```sh
    cd frontend
    npm install
    ```
4. Start the Backend Server
    ```sh
    cd backend
    npm run dev
    ```
5. Start the Frontend Server
    ```sh
    cd frontend
    npm run dev
    ```
6. Open [http://localhost:3001](http://localhost:3001) in your browser to see the frontend.

> [!NOTE]
> Step 5 and Step 6 should be run in separate terminals but both processes should be running simultaneously.

8. Backend running on [http://localhost:3000](http://localhost:3000).

9. To see the Database open [http://localhost:5555](http://localhost:5555) in your browser.

## API Testing

You can test the API using Postman. Import the following Postman collection to get started:

[Postman Collection Link]()

