'use client';

import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import type { TMStateUpdate, TMOutboundMessage } from '../types';

interface TMIframeProps {
  mode: 'tape' | 'diagram' | 'full';
  height?: number;
  onStateUpdate?: (state: TMStateUpdate) => void;
  className?: string;
  id?: string;
}

export interface TMIframeHandle {
  sendMessage: (msg: TMOutboundMessage) => void;
}

const TMIframe = forwardRef<TMIframeHandle, TMIframeProps>(
  ({ mode, height = 500, onStateUpdate, className = '', id }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const sendMessage = useCallback((msg: TMOutboundMessage) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(msg, '*');
      }
    }, []);

    useImperativeHandle(ref, () => ({ sendMessage }), [sendMessage]);

    useEffect(() => {
      const handler = (event: MessageEvent) => {
        if (event.data?.type === 'STATE_UPDATE') {
          onStateUpdate?.(event.data as TMStateUpdate);
        }
      };
      window.addEventListener('message', handler);
      return () => window.removeEventListener('message', handler);
    }, [onStateUpdate]);

    return (
      <div className={`toc-iframe-wrapper ${className}`} id={id}>
        <iframe
          ref={iframeRef}
          src={`/sims/turing-machine-viz/index.html?mode=${mode}`}
          height={height}
          className="toc-iframe"
          title="Turing Machine Simulator"
          aria-label={`Turing Machine Simulator — ${mode} mode`}
        />
      </div>
    );
  }
);

TMIframe.displayName = 'TMIframe';
export default TMIframe;
