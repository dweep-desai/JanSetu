import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ServiceOnboardingRequest, Service } from '../../types';
import './ProviderDashboard.css';

const ProviderDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceOnboardingRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_url: '',
    category: 'OTHER',
    service_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, servicesRes] = await Promise.all([
        api.get('/services/onboarding-requests'),
        api.get('/services/my-services'),
      ]);
      setRequests(requestsRes.data);
      setServices(servicesRes.data.services || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/services/onboard', formData);
      setShowForm(false);
      setFormData({ name: '', description: '', base_url: '', category: 'OTHER', service_id: '' });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to submit request');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      await api.delete(`/services/onboarding-requests/${id}`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to delete request');
    }
  };

  return (
    <div className="provider-dashboard">
      <div className="dashboard-header">
        <h2>Service Provider Dashboard</h2>
        <button onClick={() => setShowForm(!showForm)} className="primary-btn">
          {showForm ? 'Cancel' : 'Submit New Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="onboarding-form">
          <h3>Service Onboarding Request</h3>
          <div className="form-group">
            <label>Service Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Service ID (URL-friendly)</label>
            <input
              type="text"
              value={formData.service_id}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>Base URL</label>
            <input
              type="url"
              value={formData.base_url}
              onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="HEALTHCARE">Healthcare</option>
              <option value="AGRICULTURE">Agriculture</option>
              <option value="GRIEVANCE">Grievance</option>
              <option value="EDUCATION">Education</option>
              <option value="UTILITIES">Utilities</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <button type="submit" className="primary-btn">Submit Request</button>
        </form>
      )}

      <div className="dashboard-section">
        <h3>My Services</h3>
        <div className="services-list">
          {services.map((service) => (
            <div key={service.id} className="service-item">
              <h4>{service.name}</h4>
              <p>{service.description}</p>
              <span className={`status-badge ${service.status.toLowerCase()}`}>
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Onboarding Requests</h3>
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request.id} className="request-item">
              <div>
                <h4>{request.name}</h4>
                <p>{request.description}</p>
                <span className={`status-badge ${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
                {request.admin_notes && (
                  <p className="admin-notes">Admin Notes: {request.admin_notes}</p>
                )}
              </div>
              {(request.status === 'PENDING' || request.status === 'CHANGES_REQUESTED') && (
                <button
                  onClick={() => handleDelete(request.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
