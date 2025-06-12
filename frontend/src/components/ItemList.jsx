import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useItems } from '../context/ItemContext';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

function ItemList() {
  const { items, loading, error, deleteItem, fetchItems } = useItems();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // The fetchItems is now handled by the ItemContext provider
    // This is a fallback if needed
    if (items.length === 0 && !loading) {
      fetchItems();
    }
  }, [fetchItems, items.length, loading]);

  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        toast.success('Item deleted successfully');
      } catch (err) {
        toast.error('Failed to delete item');
      }
    }
  };

  if (loading) return <Loader />;  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-collection me-2"></i>
          Items
        </h2>
        <Link to="/items/new" className="btn btn-success">
          <i className="bi bi-plus-lg me-1"></i> Add Item
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search items by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="btn btn-outline-secondary" 
              type="button"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {error && <ErrorAlert message={error} />}
      
      {items.length === 0 ? (
        <div className="text-center py-5 my-4 bg-light rounded">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="lead mt-3">No items found.</p>
          <Link to="/items/new" className="btn btn-primary mt-2">
            <i className="bi bi-plus-lg me-1"></i> Add Your First Item
          </Link>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-5 my-4 bg-light rounded">
          <i className="bi bi-search display-1 text-muted"></i>
          <p className="lead mt-3">No items match your search.</p>
          <button className="btn btn-primary mt-2" onClick={() => setSearchTerm('')}>
            Clear Search
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredItems.map(item => (
            <div key={item._id} className="col-md-4 col-sm-6 mb-4">
              <div className="card h-100 shadow-sm hover-shadow">
                <div className="card-header bg-white border-bottom-0 py-3">
                  <h5 className="card-title mb-0 text-truncate">{item.name}</h5>
                </div>
                <div className="card-body">
                  {item.description ? (
                    <p className="card-text">{item.description}</p>
                  ) : (
                    <p className="card-text text-muted"><em>No description provided</em></p>
                  )}
                </div>
                <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </small>
                  <div>
                    <Link 
                      to={`/items/edit/${item._id}`} 
                      className="btn btn-sm btn-outline-primary me-2"
                      title="Edit Item"
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="btn btn-sm btn-outline-danger"
                      title="Delete Item"
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemList;