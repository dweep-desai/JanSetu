import React from 'react';
import { Service } from '../../types';
import './ServiceCard.css';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div className="service-card" onClick={onClick}>
      <h3>{service.name}</h3>
      <p className="service-description">{service.description || 'No description available'}</p>
      <div className="service-meta">
        <span className="service-category">{service.category}</span>
        <span className={`service-status ${service.status.toLowerCase()}`}>
          {service.status}
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;
