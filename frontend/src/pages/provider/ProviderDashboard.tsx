import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ServiceOnboardingRequest, Service } from '../../types';
import './ProviderDashboard.css';

interface Appointment {
    consultation_id: string;
    citizen_id: string;
    esanjeevani_provider_id: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    symptoms: string | null;
    medical_history: string | null;
    rejection_reason: string | null;
    provider_notes: string | null;
    created_at: string;
    updated_at: string;
    citizen_name: string | null;
    citizen_phone: string | null;
}

const ProviderDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceOnboardingRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'appointments'>('appointments');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [providerNotes, setProviderNotes] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_url: '',
    category: 'OTHER',
    service_id: '',
  });

  useEffect(() => {
    fetchData();
    fetchAppointments();
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

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/provider/appointments');
      setAppointments(response.data);
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      // If user is not an e-Sanjeevani provider, this is okay
      if (error.response?.status !== 404) {
        console.error('Error fetching appointments:', error);
      }
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

  const handleAppointmentAction = async () => {
    if (!selectedAppointment || !actionType) return;

    if (actionType === 'reject' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    try {
      await api.put(`/appointments/provider/appointments/${selectedAppointment.consultation_id}/action`, {
        action: actionType === 'approve' ? 'APPROVE' : 'REJECT',
        rejection_reason: actionType === 'reject' ? rejectionReason : null,
        provider_notes: actionType === 'approve' ? providerNotes : null
      });
      
      setSelectedAppointment(null);
      setActionType(null);
      setRejectionReason('');
      setProviderNotes('');
      fetchAppointments();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to process appointment');
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

      {/* Tabs */}
      <div className="provider-tabs">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`provider-tab ${activeTab === 'appointments' ? 'active' : ''}`}
        >
          Appointment Requests
          {appointments.filter(a => a.status === 'PENDING').length > 0 && (
            <span className="tab-badge">{appointments.filter(a => a.status === 'PENDING').length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`provider-tab ${activeTab === 'services' ? 'active' : ''}`}
        >
          My Services
        </button>
      </div>

      {/* Appointment Requests Tab */}
      {activeTab === 'appointments' && (
        <>
          <div className="dashboard-section">
            <h3>Appointment Requests</h3>
            <div className="appointments-list">
              {appointments.length === 0 ? (
                <p>No appointment requests yet.</p>
              ) : (
                appointments.map((appointment) => (
                  <div
                    key={appointment.consultation_id}
                    className={`appointment-item ${appointment.status === 'PENDING' ? 'pending' : ''}`}
                    onClick={() => appointment.status === 'PENDING' && setSelectedAppointment(appointment)}
                  >
                    <div>
                      <h4>{appointment.citizen_name || 'Unknown Citizen'}</h4>
                      <p>Date: {appointment.appointment_date} | Time: {appointment.appointment_time}</p>
                      {appointment.citizen_phone && <p>Phone: {appointment.citizen_phone}</p>}
                      {appointment.symptoms && <p className="meta">Symptoms: {appointment.symptoms}</p>}
                      <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                      {appointment.rejection_reason && (
                        <p className="rejection-reason">Rejection Reason: {appointment.rejection_reason}</p>
                      )}
                      {appointment.provider_notes && (
                        <p className="provider-notes">Your Notes: {appointment.provider_notes}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Appointment Action Modal */}
          {selectedAppointment && (
            <div className="modal">
              <div className="modal-content">
                <h3>Review Appointment Request</h3>
                <div className="request-details">
                  <p><strong>Citizen:</strong> {selectedAppointment.citizen_name}</p>
                  <p><strong>Phone:</strong> {selectedAppointment.citizen_phone || 'N/A'}</p>
                  <p><strong>Date:</strong> {selectedAppointment.appointment_date}</p>
                  <p><strong>Time:</strong> {selectedAppointment.appointment_time}</p>
                  {selectedAppointment.symptoms && (
                    <p><strong>Symptoms:</strong> {selectedAppointment.symptoms}</p>
                  )}
                  {selectedAppointment.medical_history && (
                    <p><strong>Medical History:</strong> {selectedAppointment.medical_history}</p>
                  )}
                </div>

                {!actionType ? (
                  <div className="action-buttons">
                    <button
                      onClick={() => setActionType('approve')}
                      className="approve-btn"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setActionType('reject')}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAppointment(null);
                        setActionType(null);
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="action-form">
                    <label>
                      {actionType === 'approve' ? 'Provider Notes (Optional):' : 'Rejection Reason (Required):'}
                    </label>
                    <textarea
                      value={actionType === 'approve' ? providerNotes : rejectionReason}
                      onChange={(e) => actionType === 'approve' ? setProviderNotes(e.target.value) : setRejectionReason(e.target.value)}
                      rows={4}
                      required={actionType === 'reject'}
                      placeholder={actionType === 'approve' ? 'Add any notes about this appointment...' : 'Please provide a reason for rejection...'}
                    />
                    <div className="form-actions">
                      <button onClick={handleAppointmentAction} className="primary-btn">
                        {actionType === 'approve' ? 'Approve Appointment' : 'Reject Appointment'}
                      </button>
                      <button
                        onClick={() => {
                          setActionType(null);
                          setRejectionReason('');
                          setProviderNotes('');
                        }}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* My Services Tab */}
      {activeTab === 'services' && (
        <>
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
        </>
      )}
    </div>
  );
};

export default ProviderDashboard;
