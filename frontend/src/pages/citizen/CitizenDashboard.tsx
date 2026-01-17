import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ServiceCard from '../../components/common/ServiceCard';
import { Service } from '../../types';
import './CitizenDashboard.css';

const CitizenDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // In a real implementation, this would fetch from /services endpoint
      // For now, we'll use a mock or gateway endpoint
      const response = await api.get('/admin/services');
      if (response.data && Array.isArray(response.data)) {
        setServices(response.data.filter((s: Service) => s.status === 'ACTIVE'));
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div className="citizen-dashboard">
      <h2>Available Services</h2>
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onClick={() => handleServiceClick(service)}
          />
        ))}
      </div>
      {services.length === 0 && (
        <div className="empty-state">
          <p>No services available at the moment.</p>
        </div>
      )}
      {selectedService && (
        <div className="service-modal">
          <div className="modal-content">
            <h3>{selectedService.name}</h3>
            <p>{selectedService.description}</p>
            <p>Access this service via: /gateway/{selectedService.service_id}/</p>
            <button onClick={() => setSelectedService(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
