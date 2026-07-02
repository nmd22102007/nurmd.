import React from 'react';

export const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 12A10 10 0 0 1 12 22c-1.7 0-3.3-.4-4.7-1.2L2 22l1.2-5.3A10 10 0 1 1 22 12z" />
    <path d="M16.5 14s-1.5 2-1.8 2c-.3 0-.7-.2-1-.3a8 8 0 0 1-4.2-4.2c-.1-.3-.3-.7-.3-1 0-.3 2-1.8 2-1.8s.2-.5-.1-.9l-1.6-3.7c-.2-.5-.7-.5-1-.5H7.3c-.6 0-1.2.5-1.3 1-.3 1.5-.2 3.4 1.3 6 1.6 2.8 4.2 4.3 6.8 4.3h.4c.6-.1 1.1-.7 1.1-1.3v-1.3c0-.3 0-.8-.5-1l-3.9-1.6c-.4-.2-.8 0-.8 0z" fill="currentColor" stroke="none" />
  </svg>
);
