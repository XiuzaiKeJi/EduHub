'use client';

import { useEffect, useState } from 'react';
import { Button } from './button';
import { X } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消'
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <Button 
            disabled={loading} 
            variant="outline" 
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button 
            disabled={loading} 
            variant="destructive" 
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}; 