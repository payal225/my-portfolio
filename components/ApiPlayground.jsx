'use client';

import { useState, useEffect } from 'react';
import {
  Play,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  Database,
  Cpu,
  Globe,
  Clock,
  HardDrive,
  Code2,
} from 'lucide-react';
import { PROJECT_API_SPECS } from '../data/projectApiData';
import { soundEngine } from '../lib/soundEffects';
import { showToast } from '../lib/toastManager';

export default function ApiPlayground({ projectId }) {
  const projectSpec = PROJECT_API_SPECS[projectId] || PROJECT_API_SPECS.habitflow;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const endpoint = projectSpec.endpoints[selectedIdx] || projectSpec.endpoints[0];

  const [requestBodyText, setRequestBodyText] = useState(() =>
    endpoint.defaultBody ? JSON.stringify(endpoint.defaultBody, null, 2) : ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(endpoint.mockResponse);
  const [activePipelineStep, setActivePipelineStep] = useState(endpoint.pipeline.length);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Update request body when selecting a different endpoint
  useEffect(() => {
    if (endpoint.defaultBody) {
      setRequestBodyText(JSON.stringify(endpoint.defaultBody, null, 2));
    } else {
      setRequestBodyText('');
    }
    setResponse(endpoint.mockResponse);
    setActivePipelineStep(endpoint.pipeline.length);
  }, [endpoint]);

  const handleSelectEndpoint = (index) => {
    soundEngine.playClick();
    setSelectedIdx(index);
  };

  const handleSendRequest = () => {
    soundEngine.playClick();
    setIsLoading(true);
    setActivePipelineStep(0);

    // Simulate animated pipeline step progression
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setActivePipelineStep(step);
      if (step >= endpoint.pipeline.length) {
        clearInterval(interval);
        setIsLoading(false);

        // Slightly jitter latency for realism (e.g. +/- 4ms)
        const baseLatency = endpoint.mockResponse.latencyMs;
        const jitter = Math.floor(Math.random() * 8) - 4;
        const realLatency = Math.max(18, baseLatency + jitter);

        // If user edited request body, echo updated fields into response if applicable
        let finalResponse = { ...endpoint.mockResponse, latencyMs: realLatency };
        try {
          if (requestBodyText && endpoint.method === 'POST') {
            const parsed = JSON.parse(requestBodyText);
            if (finalResponse.body?.data) {
              finalResponse = {
                ...finalResponse,
                body: {
                  ...finalResponse.body,
                  data: {
                    ...finalResponse.body.data,
                    ...parsed,
                    updatedAt: new Date().toISOString(),
                  },
                },
              };
            }
          }
        } catch {
          // Invalid JSON; response keeps defaults
        }

        setResponse(finalResponse);
        showToast({
          title: `${endpoint.method} 200 OK (${realLatency}ms)`,
          message: `Endpoint ${endpoint.path} executed successfully`,
          type: 'success',
        });
      }
    }, 120);
  };

  const handleCopyUrl = () => {
    soundEngine.playClick();
    const fullUrl = `${projectSpec.baseUrl}${endpoint.path}`;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1800);
    showToast({ title: 'URL Copied', message: fullUrl, type: 'info' });
  };

  const handleCopyResponse = () => {
    soundEngine.playClick();
    navigator.clipboard?.writeText(JSON.stringify(response.body, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1800);
    showToast({ title: 'JSON Copied', message: 'Response payload copied to clipboard', type: 'info' });
  };

  const handleResetBody = () => {
    soundEngine.playClick();
    if (endpoint.defaultBody) {
      setRequestBodyText(JSON.stringify(endpoint.defaultBody, null, 2));
    }
  };

  return (
    <div className="api-playground-root">
      {/* Overview Tagline */}
      <div className="api-playground-intro">
        <div className="api-intro-left">
          <span className="api-badge-pulse">LIVE REST SIMULATOR</span>
          <p className="api-intro-desc">{projectSpec.description}</p>
        </div>
        <div className="api-base-tag">
          <Globe size={13} color="var(--neon-cyan)" />
          <span>{projectSpec.baseUrl}</span>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="api-endpoint-tabs">
        {projectSpec.endpoints.map((ep, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={ep.id}
              onClick={() => handleSelectEndpoint(idx)}
              className={`api-endpoint-tab ${isSelected ? 'active' : ''}`}
            >
              <span className={`method-chip ${ep.method.toLowerCase()}`}>
                {ep.method}
              </span>
              <span className="endpoint-name">{ep.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Route Address Bar */}
      <div className="api-route-bar">
        <div className="route-bar-left">
          <span className={`route-method-badge ${endpoint.method.toLowerCase()}`}>
            {endpoint.method}
          </span>
          <span className="route-path-text">{endpoint.path}</span>
        </div>

        <div className="route-bar-actions">
          <button
            onClick={handleCopyUrl}
            className="route-copy-btn"
            title="Copy Endpoint URL"
            aria-label="Copy route URL"
          >
            {copiedUrl ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          </button>

          <button
            onClick={handleSendRequest}
            disabled={isLoading}
            className={`api-send-btn ${isLoading ? 'loading' : ''}`}
            title="Send Simulated Request"
          >
            <Play size={13} fill="currentColor" />
            <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
          </button>
        </div>
      </div>

      <p className="endpoint-explainer">{endpoint.description}</p>

      {/* Request Flow Pipeline */}
      <div className="api-pipeline-container">
        <div className="pipeline-header">
          <span className="pipeline-title">EXECUTION PIPELINE TRACE</span>
          <span className="pipeline-sub">End-to-End MERN Request Journey</span>
        </div>
        <div className="pipeline-steps-grid">
          {endpoint.pipeline.map((p, idx) => {
            const isCompleted = activePipelineStep > idx;
            const isCurrent = activePipelineStep === idx && isLoading;
            return (
              <div
                key={idx}
                className={`pipeline-step-card ${isCompleted ? 'completed' : ''} ${
                  isCurrent ? 'current' : ''
                }`}
              >
                <div className="step-card-num-row">
                  <span className="step-circle">
                    {isCompleted ? <Check size={11} strokeWidth={3} /> : idx + 1}
                  </span>
                  <span className="step-name">{p.step}</span>
                </div>
                <p className="step-detail">{p.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Request & Response Split Layout */}
      <div className="api-io-grid">
        {/* Request Pane */}
        <div className="api-io-panel request-panel">
          <div className="io-panel-header">
            <div className="panel-title-group">
              <Code2 size={14} color="var(--neon-cyan)" />
              <span className="panel-title">REQUEST PAYLOAD</span>
            </div>
            {endpoint.defaultBody && (
              <button
                onClick={handleResetBody}
                className="io-reset-btn"
                title="Reset to default payload"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Headers preview */}
          <div className="request-headers-box">
            <div className="headers-label">HEADERS</div>
            {Object.entries(endpoint.headers).map(([k, v]) => (
              <div key={k} className="header-item">
                <span className="header-key">{k}:</span>
                <span className="header-val">{v}</span>
              </div>
            ))}
          </div>

          {/* Request Body JSON */}
          {endpoint.method === 'POST' ? (
            <div className="json-editor-wrapper">
              <div className="headers-label">BODY (JSON)</div>
              <textarea
                value={requestBodyText}
                onChange={(e) => setRequestBodyText(e.target.value)}
                className="api-json-textarea"
                rows={7}
                spellCheck={false}
                aria-label="Request Body JSON editor"
              />
            </div>
          ) : (
            <div className="no-body-notice">
              <span>GET requests carry query parameters in URL</span>
            </div>
          )}
        </div>

        {/* Response Pane */}
        <div className="api-io-panel response-panel">
          <div className="io-panel-header">
            <div className="panel-title-group">
              <Database size={14} color="var(--neon-purple)" />
              <span className="panel-title">RESPONSE PREVIEW</span>
            </div>

            <div className="response-stats-group">
              <span className="response-status-badge">
                <span className="status-dot"></span>
                {response.status} OK
              </span>
              <span className="response-stat-pill">
                <Clock size={11} />
                {response.latencyMs}ms
              </span>
              <button
                onClick={handleCopyResponse}
                className="response-copy-btn"
                title="Copy Response JSON"
              >
                {copiedJson ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div className="response-json-viewer">
            <pre className="json-pre">
              <code>{JSON.stringify(response.body, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
