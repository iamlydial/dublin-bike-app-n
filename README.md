# Dublin Bike App - Server

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
    git clone https://github.com/iamlydial/dublin-bike-app-n
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

This route generates a dynamic schema based on the fetched data from the bike database. It provides information about the available fields and their respective data types (e.g., `BOOLEAN`, `STRING`, `INTEGER`, `DATETIME`).

#### Example Request

```bash
GET /schema

### `POST /data`

This route applies the dynamic geneareted schema and multiple filters 

#### Example Request

```bash
POST /data

