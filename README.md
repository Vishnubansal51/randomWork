# SQL Query Viewer - React Application

## Overview
The **SQL Query Viewer** is a React-based web application that allows users to interact with SQL queries. Users can select predefined queries, write custom SQL queries, and view or modify data in a table format. It supports CRUD operations (Create, Read, Update, Delete) on custom tables and provides an easy interface for managing SQL queries.

## Features
- **Query Selector**: Allows users to choose from predefined queries or create custom queries.
- **Query Editor**: A text area to write SQL queries and modify them.
- **Query Result**: Displays the results of the executed queries in a table format.
- **Custom Table Management**: Users can create, edit, and delete custom tables with dynamic queries.
- **Dark/Light Mode**: A toggle to switch between dark and light modes for better user experience.
- **Search**: Ability to search within query results.

## System Design
- **Frontend**: Built using React.js. The application consists of three main components:
  - `QuerySelector`: Allows selecting predefined or custom queries.
  - `QueryEditor`: A text editor for writing or modifying SQL queries.
  - `QueryResultTable`: Displays the results in a tabular format.
  
- **State Management**: The state keeps track of custom tables and the queries list. These are updated dynamically as users interact with the system.

- **Query Handlers**: Utilities to handle SQL operations such as SELECT, UPDATE, and DELETE for both predefined and custom queries.

- **Data Sources**: 
  - Predefined queries are stored in `queries.js`.
  - Custom tables are stored in memory, allowing the user to dynamically manage them.

## Setup Instructions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vishnubansal51/randomWork.git
2. Navigate to the project folder:
 ```bash
    cd root folder name
  ```
3.Install the dependencies:
  ```bash
 npm install
```
4. Start the development server:
  ```bash
     npm start
  ```
5. Open http://localhost:3000 in your browser to view the app.


