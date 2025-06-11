import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as api from '../services/api';
import { useItems } from '../context/ItemContext';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

function ItemForm() {
  const [item, setItem] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { addItem, updateItem } = useItems();

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getItem(id)
        .then(res => {
          setItem(res.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load item');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (id) {
        // Use the context updateItem instead of direct API call
        await updateItem(id, item);
        toast.success('Item updated successfully!');
      } else {
        // Use the context addItem instead of direct API call
        await addItem(item);
        toast.success('Item created successfully!');
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save item');
      toast.error(err.message || 'Failed to save item');
      setLoading(false);
    }
  };

  if (loading && id) return <Loader />;
  return (
    <div className="mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="h4 mb-0">
              <i className={`bi ${id ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
              {id ? 'Edit Item' : 'Add New Item'}
            </h2>
            <Link to="/" className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-arrow-left me-1"></i> Back to Items
            </Link>
          </div>
        </div>
        <div className="card-body">
          {error && <ErrorAlert message={error} />}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label fw-medium">
                <i className="bi bi-tag me-1"></i> Name
              </label>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                id="name" 
                name="name"
                value={item.name} 
                onChange={handleChange} 
                placeholder="Enter item name"
                autoFocus
                required 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="form-label fw-medium">
                <i className="bi bi-text-paragraph me-1"></i> Description
              </label>
              <textarea 
                className="form-control" 
                id="description" 
                name="description"
                value={item.description || ''} 
                onChange={handleChange} 
                placeholder="Enter item description (optional)"
                rows="5"
              ></textarea>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2 me-1"></i> {id ? 'Update' : 'Create'} Item
                  </>
                )}
              </button>
              <Link to="/" className="btn btn-outline-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ItemForm;