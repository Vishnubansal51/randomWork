import React, { useState } from "react";
import { queries } from "./data/queries";
import QuerySelector from "./components/QuerySelector";
import QueryEditor from "./components/QueryEditor";
import QueryResultTable from "./components/QueryResultTable";

import {
  handlePredefinedSelect,
  handleCustomSelect,
  handleUpdate,
  handleDelete
} from './utils/queryHandlers';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(!darkMode);

  const [selectedQueryId, setSelectedQueryId] = useState(queries[0].id);
  const [queryText, setQueryText] = useState(queries[0].query);

  const [customTables, setCustomTables] = useState([]);
  const [selectedCustomTable, setSelectedCustomTable] = useState(null);
  const [newTable, setNewTable] = useState({ name: "", columns: "" });
  const [newRow, setNewRow] = useState({});
  const [search, setSearch] = useState("");
 
  const [queriesList, setQueriesList] = useState(queries); 
  const [queryResult, setQueryResult] = useState(null); 

  const handleQuerySelect = (queryId) => {


    if (!queryId) {
     
      setSelectedQueryId('');
      setQueryText(''); 
      setSelectedCustomTable(null); 
      setQueryResult(null);
      return;
    }
  
    const selectedQuery = queriesList.find((query) => query.id === queryId);

    if (selectedQuery) {
      
      setSelectedQueryId(queryId);
      setQueryText(selectedQuery.query);

      if (selectedQuery.id.startsWith("custom_")) {
       
        const tableNameMatch = selectedQuery.query.match(/SELECT \* FROM (\w+);/i);
        if (tableNameMatch) {
          const tableName = tableNameMatch[1];
          const customTable = customTables.find((table) => table.name === tableName);
          setSelectedCustomTable(customTable); 
        }
      } else {
        setSelectedCustomTable(null); 
      }

    } else {

      const fallbackQuery = queriesList[0];
      setSelectedQueryId(fallbackQuery.id);
      setQueryText(fallbackQuery.query);
      setSelectedCustomTable(null); 
    }
  };


  const addCustomQuery = (tableName) => {
    const newQuery = {
      id: `custom_${tableName}`,
      label: `Get All ${tableName}`,
      query: `SELECT * FROM ${tableName};`,
      result:
        customTables.find((table) => table.name === tableName)?.data || [],
    };

    setQueriesList((prevQueries) => [...prevQueries, newQuery]);

    setSelectedQueryId(newQuery.id);
    setQueryText(newQuery.query);
  };
  
  const createTable = () => {

  const tableName = newTable.name.trim();
  const columnsInput = newTable.columns.trim();

  // Validate table name
  if (!tableName) {
    alert("Table name cannot be empty!");
    return;
  }

  // Validate columns
  if (!columnsInput) {
    alert("Column names cannot be empty!");
    return;
  }
     // Split columns and filter out empty values
  const columns = columnsInput.split(',')
  .map(col => col.trim())
  .filter(col => col !== '');

  if (columns.length === 0) {
    alert("At least one column is required!");
    return;
  }
  // Check for duplicate table names
  const tableExists = customTables.some(table => table.name === tableName);
  if (tableExists) {
    alert("A table with this name already exists!");
    return;
  }
    
    const table = {
      name: newTable.name,
      columns,
      data: [],
    };
    setCustomTables([...customTables, table]);
 
    addCustomQuery(newTable.name);
    setNewTable({ name: "", columns: "" });
  };




  
  const insertRow = () => {
    if (!selectedCustomTable) {
      alert("Please select a custom table.");
      return;
    }
 
  const missingColumns = selectedCustomTable.columns
  .filter(col => col !== 'ID')
  .filter(col => !newRow[col] || newRow[col].trim() === '');

  if (missingColumns.length > 0) {
    alert(`Missing values for: ${missingColumns.join(', ')}`);
    return;
  }

   
    const currentData = selectedCustomTable.data;
    const newId = currentData.length > 0 
      ? Math.max(...currentData.map(row => row.ID)) + 1 
      : 1;
  
    const newRowWithId = { ...newRow, ID: newId };
  
    // Update the custom tables state
    const updatedTables = customTables.map((table) => {
      if (table.name === selectedCustomTable.name) {
        return { ...table, data: [...table.data, newRowWithId] };
      }
      return table;
    });
  
    setCustomTables(updatedTables);
  
    
    const updatedTable = updatedTables.find(
      (table) => table.name === selectedCustomTable.name
    );
    setSelectedCustomTable(updatedTable); // Force update selected table
  
    setNewRow({}); // Reset input fields
  };


  const handleEditClick = (index, row) => {
    

    if (!selectedCustomTable) {
      alert(
        "Editing is available only for custom tables. Please select a custom table."
      );
      return;
    }
    // Build the UPDATE query based on the custom table
    const query = `UPDATE ${
      selectedCustomTable.name
    } SET ${selectedCustomTable.columns
      .map((col) => `${col} = '${row[col]}'`)
      .join(", ")} WHERE ID = ${row.ID};`;

    setQueryText(query); 
  };
  const handleDeleteClick = (index, row) => {
    
    if (!selectedCustomTable) {
      alert(
        "Deleting is available only for custom tables. Please select a custom table."
      );
      return;
    }

    const query = `DELETE FROM ${selectedCustomTable.name} WHERE ID = ${row.ID};`;
   
    setQueryText(query); 
  };
  const runQuery = () => {
    const trimmedQuery = queryText.trim();
  
    
    if (handlePredefinedSelect(trimmedQuery, setQueryResult, queries)) return;
    if (handleCustomSelect(trimmedQuery, customTables, setQueryResult)) return;
    if (handleUpdate(trimmedQuery, customTables, setCustomTables, setQueryResult)) return;
    if (handleDelete(trimmedQuery, customTables, setCustomTables, setQueryResult))
    return ;

  alert("Unsupported query");
    

  };


  return (
    <div
      className={`container my-5 ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
      style={{ minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>SQL Query Viewer</h1>
        <button className="btn btn-outline-secondary" onClick={toggleTheme}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Query Selector */}
      <QuerySelector
        // queries={queries}
        queries={queriesList}
        selectedQueryId={selectedQueryId}
        onSelectQuery={handleQuerySelect}
      />

      {/* Query Editor */}
      <QueryEditor value={queryText} onChange={setQueryText} />
      {/* Run Query Button */}
      <div className="mb-3">
        <button className="btn btn-primary" onClick={runQuery}>
          Run Query
        </button>
      </div>

      {queryResult && (
        <QueryResultTable
          data={queryResult}
          search={search}
          onUpdate={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Create New Table */}
      <hr />
      <h3>Create New Table</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Table name *"
          value={newTable.name }
          onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Column names (comma separated)*"
          value={newTable.columns }
          onChange={(e) =>
            setNewTable({ ...newTable, columns: e.target.value })
          }
          required
        />
        <button className="btn btn-primary" onClick={createTable}
         disabled={!newTable.name.trim() || !newTable.columns.trim()} 
        >

          Create Table
        </button>
      </div>

      {/* Insert Data into Table */}
      {customTables.length > 0 && (
        <>
          <h3 className="mt-4">Insert Data into Table</h3>
          <select
            className="form-select mb-3"
            value={selectedCustomTable?.name || ""}
            onChange={(e) => {
              const table = customTables.find((t) => t.name === e.target.value);
              setSelectedCustomTable(table);
              setNewRow({});
            }}
          >
            <option value="">Select table</option>
            {customTables.map((table) => (
              <option key={table.name} value={table.name}>
                {table.name}
              </option>
            ))}
          </select>

          {selectedCustomTable && (
            <div>
              {selectedCustomTable.columns.filter(col => col !== 'ID') 
              .map((col) => (
                <input
                  key={col}
                  type="text"
                  className="form-control mb-2"
                  placeholder={`Enter ${col} *`}
                  value={newRow[col] || ""}
                  onChange={(e) =>
                    setNewRow({ ...newRow, [col]: e.target.value })
                  }
                  required
                />
              ))}
              <button className="btn btn-success" onClick={insertRow}
              disabled={
                
                !selectedCustomTable || 
            
                selectedCustomTable.columns
                  .filter(col => col !== 'ID')
                  .some(col => !newRow[col]?.trim())
              }
              >

                Insert Row
              </button>
            </div>
          )}
        </>
      )}

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search table..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Display Selected Custom Table */}
      {selectedCustomTable && (
        <>
          <h3 className="mt-4">Table Data: {selectedCustomTable.name}</h3>
          <QueryResultTable
            data={selectedCustomTable.data}
            search={search}
          />
        </>
      )}
    </div>
  );
}

export default App;
