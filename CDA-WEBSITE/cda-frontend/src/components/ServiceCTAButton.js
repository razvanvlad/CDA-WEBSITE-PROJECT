'use client';
import { useState } from 'react';
import HubSpotModal from './HubSpotModal';

const ServiceCTAButton = ({ serviceSlug, serviceName, ctaText = 'Get Started', className = 'button-l' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={className}
        type="button"
      >
        {ctaText}
      </button>

      <HubSpotModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        serviceSlug={serviceSlug}
        serviceName={serviceName}
      />
    </>
  );
};

export default ServiceCTAButton;