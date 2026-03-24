'use client';

import React from 'react';
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

interface AddressAutocompleteProps {
  apiKey: string;
  onAddressSelected: (address: any) => void;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  value?: string;
}

export default function AddressAutocomplete({ apiKey, onAddressSelected, placeholder, value }: AddressAutocompleteProps) {
  
  function onPlaceSelect(value: any) {
    if (!value) return;
    
    const props = value.properties;
    
    // Construct address more robustly with multiple fallbacks
    const streetAddress = [props.housenumber, props.street].filter(Boolean).join(' ') 
      || props.address_line1 
      || props.name 
      || props.formatted
      || props.city 
      || 'Selected Location';

    const addressData = {
      address: streetAddress,
      city: props.city || props.town || props.village || props.suburb || 'Unknown City',
      stateProvince: props.state_code || props.state || '',
      postalCode: props.postcode || '',
      country: props.country_code?.toUpperCase() || 'CA'
    };
    
    onAddressSelected(addressData);
  }

  return (
    <div className="address-autocomplete-container relative w-full group">
      <GeoapifyContext apiKey={apiKey}>
        <GeoapifyGeocoderAutocomplete
          placeholder={placeholder || "Start typing your address..."}
          value={value}
          filterByCountryCode={['ca']}
          limit={5}
          placeSelect={onPlaceSelect}
        />
      </GeoapifyContext>

      <style jsx global>{`
        .address-autocomplete-container .geoapify-autocomplete-input {
          width: 100% !important;
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          color: white !important;
          font-family: inherit !important;
          font-size: 14px !important;
          transition: all 0.3s ease !important;
          outline: none !important;
        }

        .address-autocomplete-container .geoapify-autocomplete-input:focus {
          border-color: #00ffff !important;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2) !important;
        }

        .address-autocomplete-container .geoapify-autocomplete-items {
          background: rgba(10, 10, 10, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          margin-top: 8px !important;
          overflow: hidden !important;
          z-index: 100 !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
        }

        .address-autocomplete-container .geoapify-autocomplete-item {
          padding: 12px 16px !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 13px !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          transition: all 0.2s ease !important;
        }

        .address-autocomplete-container .geoapify-autocomplete-item:last-child {
          border-bottom: none !important;
        }

        .address-autocomplete-container .geoapify-autocomplete-item:hover,
        .address-autocomplete-container .geoapify-autocomplete-item.active {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }

        .address-autocomplete-container .geoapify-close-button {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        .address-autocomplete-container .geoapify-close-button:hover {
          color: white !important;
        }
      `}</style>
    </div>
  );
}
