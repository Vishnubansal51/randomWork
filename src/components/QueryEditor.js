import React from 'react';

const QueryEditor = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="query-editor" className="form-label">Write SQL Query</label>
      <textarea
        id="query-editor"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Select a query or start typing..."
        style={{
          fontFamily: '"Fira Code", monospace',
          fontSize: '14px',
        }}
      />
    </div>
  );
};

export default QueryEditor;
