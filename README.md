# dublin-bike-app-n
 
This is the backend server for the Dublin Bike App, built using Node.js, Express, and other utilities to fetch and filter data for the application.

## Features

- **Data Filtering**: Allows filtering data using different operators (`eq`, `lt`, `gt`).
- **Dynamic Schema Generation**: The server dynamically generates a schema based on fetched data.


## Installation

### Prerequisites

Ensure that you have the following installed:

- [Node.js](https://nodejs.org/) (v12 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Steps

1. Clone this repository to your local machine.

    ```bash
    git clone https://github.com/iamlydial/dublin-bike-app-n/
    cd dublin-bike-app-n
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the server:

    ```bash
    npm start
    ```

    The server will start on [http://localhost:3000](http://localhost:3000).

## API Routes

### `GET /schema`

The schema is dynamically generated based on the fetched data. It identifies data types and generates the appropriate schema for the fields.


### `POST /data`

This route fetches data which can be filtered.  The filtering is based on the where object passed in the request body. You can use Postman (I personally use this) or Insomnia to test the API with various filters (e.g., eq, lt, gt).

