import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
  title?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className = '',
  title = 'Copy ID to clipboard',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 ${className}`}
      title={copied ? 'Copied!' : title}
      aria-label="Copy tracking ID"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-emerald-600" />
          <span className="text-emerald-600 font-sans font-semibold text-[10px]">Copied</span>
        </>
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
};
