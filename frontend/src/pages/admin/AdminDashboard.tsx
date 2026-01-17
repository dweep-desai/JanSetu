import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ServiceOnboardingRequest } from '../../types';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceOnboardingRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceOnboardingRequest | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | 'changes' | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/admin/onboarding-requests?status_filter=PENDING');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const handleAction = async () => {
    if (!selectedRequest || !action) return;

    try {
      if (action === 'approve') {
        await api.put(`/admin/onboarding-requests/${selectedRequest.id}/approve`, null, {
          params: { admin_notes: notes },
        });
      } else if (action === 'reject') {
        await api.put(`/admin/onboarding-requests/${selectedRequest.id}/reject`, {
          admin_notes: notes,
        });
      } else if (action === 'changes') {
        await api.put(`/admin/onboarding-requests/${selectedRequest.id}/request-changes`, {
          admin_notes: notes,
        });
      }
      setSelectedRequest(null);
      setAction(null);
      setNotes('');
      fetchRequests();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to process request');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-section">
        <h3>Pending Onboarding Requests</h3>
        <div className="requests-list">
          {requests.map((request) => (
            <div
              key={request.id}
              className="request-item"
              onClick={() => setSelectedRequest(request)}
            >
              <div>
                <h4>{request.name}</h4>
                <p>{request.description}</p>
                <span className="meta">Category: {request.category} | Service ID: {request.service_id}</span>
              </div>
              <span className={`status-badge ${request.status.toLowerCase()}`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedRequest && (
        <div className="modal">
          <div className="modal-content">
            <h3>Review Request: {selectedRequest.name}</h3>
            <div className="request-details">
              <p><strong>Description:</strong> {selectedRequest.description}</p>
              <p><strong>Base URL:</strong> {selectedRequest.base_url}</p>
              <p><strong>Category:</strong> {selectedRequest.category}</p>
              <p><strong>Service ID:</strong> {selectedRequest.service_id}</p>
            </div>
            <div className="action-buttons">
              <button onClick={() => setAction('approve')} className="approve-btn">
                Approve
              </button>
              <button onClick={() => setAction('reject')} className="reject-btn">
                Reject
              </button>
              <button onClick={() => setAction('changes')} className="changes-btn">
                Request Changes
              </button>
            </div>
            {action && (
              <div className="action-form">
                <label>Admin Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  required={action !== 'approve'}
                />
                <div className="form-actions">
                  <button onClick={handleAction} className="primary-btn">
                    Submit
                  </button>
                  <button onClick={() => { setAction(null); setNotes(''); }} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <button onClick={() => { setSelectedRequest(null); setAction(null); setNotes(''); }} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
