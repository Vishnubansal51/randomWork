  
const generateLargeDataset = (numRows) => {

  const data = [];
  for (let i = 1; i <= numRows; i++) {
    data.push({
      ID: i,
      Name: `Person ${i}`,
      Age: Math.floor(Math.random() * 100) + 1, // Random age between 1 and 100
    });
  }
  return data;
};

// Handle predefined SELECT queries
export const handlePredefinedSelect = (trimmedQuery, setQueryResult, queries) => {
    const predefinedResults = {
      'SELECT * FROM users;': () => queries[0].result.map(row => ({
        ID: row.ID,
        name: row.name,
        age: row.age
      })),
      'SELECT * FROM products;': () => queries[1].result.map(row => ({
        ID: row.ID,
        name: row.name,
        price: row.price
      })),
      'SELECT * FROM large_users;': () => generateLargeDataset(1000)
    };
  
    const handler = predefinedResults[trimmedQuery];
    if (handler) {
      setQueryResult(handler());
      return true;
    }
    return false;
  };
  
  // Handle custom SELECT queries
  export const handleCustomSelect = (trimmedQuery, customTables, setQueryResult) => {
    const match = trimmedQuery.match(/SELECT \* FROM (\w+);/i);
    if (!match) return false;
  
    const tableName = match[1].toLowerCase();
    const customTable = customTables.find(
      table => table.name.toLowerCase() === tableName
    );
  
    if (customTable) {
      setQueryResult(customTable.data);
      return true;
    }
    return false;
  };
  
  // Handle UPDATE queries
  export const handleUpdate = (trimmedQuery, customTables, setCustomTables, setQueryResult) => {
    const updateMatch = trimmedQuery.match(/UPDATE (\w+) SET (.*?) WHERE (.*)/i);
    if (!updateMatch) return false;
  
    if (updateMatch) {
      
        const tableName = updateMatch[1].toLowerCase();
        const setClause = updateMatch[2];
        const whereClause = updateMatch[3];

        const customTable = customTables.find(
          (table) => table.name.toLowerCase() === tableName
        );
     
        if (customTable) {
       
          const updates = setClause.split(",").map((update) => {
            const [column, value] = update
              .split("=")
              .map((part) => part.trim());
            return { column, value: value.replace(/'/g, "") }; 
          });
          if (!customTable) return false;
     

          const whereCondition = whereClause.match(/ID\s*=\s*(\d+)/);
      
          if (!whereCondition) return false;
          if (whereCondition) {
            const id = parseInt(whereCondition[1], 10);
            
            const updatedData = customTable.data.map((row) => {
              if (row.ID === id) {
                const updatedRow = { ...row }; 
                updates.forEach((update) => {
                  updatedRow[update.column] = update.value;
                });
                return updatedRow;
              }
              return row;
            });
       
            const updatedTables = customTables.map((table) => {
              if (table.name === customTable.name) {
                return { ...table, data: updatedData };
              }
              return table;
            });
 
            setCustomTables(updatedTables); 
            setQueryResult(updatedData); 
          }
        }
       
        return true; 
      }

  };
  
  // Handle DELETE queries
  export const handleDelete = (trimmedQuery, customTables, setCustomTables, setQueryResult) => {
    const deleteMatch = trimmedQuery.match(/DELETE FROM (\w+) WHERE (.*)/i);
    if (!deleteMatch) return false;
  

    if (deleteMatch) {
        const tableName = deleteMatch[1].toLowerCase();
        const whereClause = deleteMatch[2];

        const customTable = customTables.find(
          (table) => table.name.toLowerCase() === tableName
        );
        if (customTable) {
     
          const whereCondition = whereClause.match(/ID\s*=\s*(\d+)/); 
          if (whereCondition) {
            const id = parseInt(whereCondition[1], 10);

           
            const updatedData = customTable.data.filter((row) => row.ID !== id);

            const updatedTables = customTables.map((table) => {
              if (table.name === customTable.name) {
                return { ...table, data: updatedData };
              }
              return table;
            });
            setCustomTables(updatedTables); 
            setQueryResult(updatedData); 
          }
        }
         return true;;
      }
    
  };