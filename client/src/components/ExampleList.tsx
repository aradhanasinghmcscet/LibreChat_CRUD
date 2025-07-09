import React from 'react';
import { useExample } from '../hooks/useExample';

const ExampleList: React.FC = () => {
  const {
    examples,
    loading,
    error,
    fetchExamples,
    createExample,
    updateExample,
    deleteExample,
    searchExamples,
  } = useExample();

  const handleCreate = async () => {
    try {
      const name = prompt('Enter example name:');
      if (name) {
        await createExample({ name, status: 'active' });
      }
    } catch (err) {
      console.error('Error creating example:', err);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const status = prompt('Enter new status:');
      if (status) {
        await updateExample(id, { status });
      }
    } catch (err) {
      console.error('Error updating example:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this example?')) {
      try {
        await deleteExample(id);
      } catch (err) {
        console.error('Error deleting example:', err);
      }
    }
  };

  const handleSearch = async () => {
    const name = prompt('Enter search term:');
    if (name) {
      await searchExamples(name);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Examples</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleCreate}>Create Example</button>
        <button onClick={handleSearch}>Search Examples</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {examples.map((example: any) => (
          <li key={example._id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <span style={{ marginRight: '10px' }}>{example.name}</span>
            <span style={{ marginRight: '10px' }}>{example.status}</span>
            <button onClick={() => handleUpdate(example._id)}>Update</button>
            <button onClick={() => handleDelete(example._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExampleList;
