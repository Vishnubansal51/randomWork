import React from 'react';
import { FixedSizeList as List } from 'react-window';


const Row = ({ index, style, data, onUpdate, onDelete }) => {
  const row = data.filteredData[index];
  const columns = data.columns;


  return (
    <div style={{ ...style, display: 'flex' }} className="table-row">
 
      <div
        className="table-cell"
        style={{ flex: 1, padding: '0.5rem', border: '1px solid #dee2e6' }}
      >
        {row.ID}
      </div>

      {columns
        .filter(col => col !== 'ID') 
        .map((col) => (
          <div
            key={col}
            className="table-cell"
            style={{ flex: 1, padding: '0.5rem', border: '1px solid #dee2e6' }}
          >
            {row[col]}
          </div>
        ))}

     {/* Only show actions if handlers exist */}
     {onUpdate && onDelete && (
        <div className="table-cell"  style={{
          flex: 1,
          padding: '0.5rem',
          border: '1px solid #dee2e6',
        }}>
          <button onClick={() => onUpdate(index, row)} className="btn btn-warning btn-sm">
            Edit
          </button>
          <button onClick={() => onDelete(index, row)} className="btn btn-danger btn-sm ms-2">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};





const QueryResultTable = ({ data, search = '', onUpdate, onDelete }) => {
  if (!data || data.length === 0) {
    return <div>No results to display.</div>;
  }


  const columns = ['ID', ...Object.keys(data[0]).filter(col => col !== 'ID')];


  // Filter data based on the search query
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="mb-4">
      {/* Table Header */}
      <div className="d-flex table-header fw-bold">
        {columns.map((col) => (
          <div
            key={col}
            className="table-cell"
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #dee2e6',
            }}
          >
            {col}
          </div>

        ))}

       {/* Conditionally render Actions header */}
       {onUpdate && onDelete && (
          <div className="table-cell"  style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid #dee2e6',
          }}>
            Actions
          </div>
        )}
      </div>

      {/* Virtualized list of rows */}
      <List
        height={300} // Height of the virtualized list
        itemCount={filteredData.length} // Number of items (filtered rows)
        itemSize={40} // Height of each row
        width="100%" // Width of the list
        itemData={{ filteredData, columns }} // Data passed to each row
      >
        {(props) => (
          <Row
            {...props} 
            onUpdate={onUpdate}  
            onDelete={onDelete}  
          />
        )}
      </List>
    </div>
  );
};

export default QueryResultTable;
