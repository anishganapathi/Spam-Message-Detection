# SMS Spam Classification Web App

This project consists of a FastAPI backend and a Next.js frontend for classifying SMS messages as Spam or Ham.

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm

## Setup and Running

### Backend

1.  Navigate to the project root.
2.  Install dependencies (if not already installed):
    ```bash
    pip install -r backend/requirements.txt
    ```
3.  Run the FastAPI server:
    ```bash
    uvicorn backend.main:app --reload --port 8000
    ```
    The API will be available at `http://localhost:8000`.

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Usage

1.  Open `http://localhost:3000` in your browser.
2.  Enter an SMS message in the text area.
3.  Click "Analyze Message".
4.  View the classification result (Spam/Not Spam) and the confidence score.

## Project Structure

-   `backend/`: Contains the FastAPI application (`main.py`) and requirements.
-   `frontend/`: Contains the Next.js application.
-   `spam_model.joblib`: The trained scikit-learn model (referenced by the backend).
