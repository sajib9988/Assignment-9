"use client";

import { ReactNode } from "react";

interface ModalProps {
  open: boolean; // Changed from isOpen to open for consistency
  onClose: () => void;
  children: ReactNode;
  title?: string; // Added title prop
}

export function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        {/* Title */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        
        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}