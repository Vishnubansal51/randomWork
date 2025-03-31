import React from 'react';

const QuerySelector = ({ queries, selectedQueryId, onSelectQuery }) => {
  return (
    <div className="mb-4">
      <label htmlFor="queries" className="form-label">Select a Query</label>
      <select
        id="queries"
        className="form-select"
        value={selectedQueryId}
        onChange={(e) => onSelectQuery(e.target.value)}
      >
       
        <option value="">-- Not Selected --</option>
        {queries.map((query) => (
          <option key={query.id} value={query.id}>
            {query.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default QuerySelector;
