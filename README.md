# Edge Age Calculator

This is a premium, highly animated "edge age calculator" web application. It computes a person's age in years, months, days, hours, minutes, seconds, and fractional years, with a visually stunning and responsive UI.

## Features

-   **Live Age Calculation:** Computes age down to the second.
-   **"As Of" Date Slider:** Adjust the "as of" date and time to see the age calculation update live.
-   **Animated UI:** Smooth animations for a premium user experience.
-   **Particle Animation:** A subtle, performant particle animation in the background.
-   **Responsive Design:** Works on desktop, tablet, and mobile devices.
-   **REST API:** A backend endpoint to perform age calculations.

## Project Structure

```
/
├── backend/
│   ├── utils/
│   │   └── age-calculator.js
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```

## Setup and Deployment

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or later)
-   [npm](https://www.npmjs.com/)

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd edge-age-calculator
    ```

2.  **Start the backend server:**
    ```bash
    cd backend
    npm install
    node server.js &
    cd ..
    ```
    The backend server will be running at `http://localhost:3000`.

3.  **Run the frontend:**
    Open the `frontend/index.html` file in your web browser. You can use a simple HTTP server or just open the file directly. For a better experience, use a live server extension in your code editor.

### API Usage

The backend provides an API endpoint for age calculation.

-   **Endpoint:** `/api/age`
-   **Method:** `POST`
-   **Request Body (JSON):**
    ```json
    {
      "birthdate": "YYYY-MM-DD",
      "as_of_date": "YYYY-MM-DDTHH:mm:ss.sssZ" // Optional, defaults to now
    }
    ```
-   **Success Response (JSON):**
    ```json
    {
      "years": 32,
      "months": 5,
      "days": 10,
      "hours": 15,
      "minutes": 30,
      "seconds": 5,
      "fractionalYears": 32.445
    }
    ```

## Testing

Unit tests for the backend logic can be run using Jest.

1.  **Install Jest:**
    ```bash
    cd backend
    npm install jest --save-dev
    ```

2.  **Run tests:**
    ```bash
    npm test
    ```