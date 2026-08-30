import React from 'react';
import { Inbox, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}> = ({
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  icon,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-200 ${className}`}>
      <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4 border border-slate-100">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h4 className="text-base font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = 'Something went wrong',
  message = 'We could not load the data. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-10 text-center bg-rose-50/50 rounded-xl border border-rose-200 ${className}`}>
      <div className="p-3 bg-rose-100 text-rose-600 rounded-full mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-rose-900">{title}</h4>
      <p className="text-xs text-rose-700 max-w-sm mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Retry
        </Button>
      )}
    </div>
  );
};
