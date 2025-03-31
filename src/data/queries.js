export const queries = [
    {
      id: 'q1',
      label: 'Get all users',
      query: 'SELECT * FROM users;',
      result: [
        {  ID: 1, name: 'John Doe', age: 30 },
        { ID: 2, name: 'Jane Smith', age: 25 },
        { ID: 3, name: 'Sam Brown', age: 35 },
      ]
    },
    {
      id: 'q2',
      label: 'Get all products',
      query: 'SELECT * FROM products;',
      result: [
        { ID: 1, name: 'Laptop', price: 1000 },
        { ID: 2, name: 'Phone', price: 500 },
        {ID: 3, name: 'Tablet', price: 300 },
      ]
    },

    {
      id: 'large_dataset',
      label: 'Get all large users',
      query: 'SELECT * FROM large_users;', 
      result: [], 

    }
  ];
  