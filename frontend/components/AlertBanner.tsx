'use client';

import { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface AlertBannerProps {
  type: 'error' | 'mock';
  message: string;
  onClose?: () => void;
}

export function AlertBanner({ type, message, onClose }: AlertBannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div className={`alert-banner alert-banner--${type} fade-in-up`} role="alert">
      <span className="alert-banner__icon" aria-hidden="true">
        {type === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
      </span>
      <span className="alert-banner__text">{message}</span>
      <button className="alert-banner__close" onClick={dismiss} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}
