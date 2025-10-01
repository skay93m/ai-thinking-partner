import React, { useState } from 'react';
import { X, Key, Check, AlertCircle } from 'lucide-react';

function ApiKeyModal({ isOpen, onClose, onSave, currentKey, rateLimitInfo }) {
  const [apiKey, setApiKey] = useState(currentKey || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null); // 'valid', 'invalid', or null

  if (!isOpen) return null;

  const validateAndSave = async () => {
    if (!apiKey.trim()) {
      onSave(''); // Remove key
      onClose();
      return;
    }

    if (!apiKey.startsWith('sk-ant-')) {
      setValidationStatus('invalid');
      return;
    }

    setIsValidating(true);
    setValidationStatus(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/validate-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });

      const data = await response.json();

      if (data.valid) {
        setValidationStatus('valid');
        onSave(apiKey.trim());
        setTimeout(() => {
          onClose();
          setValidationStatus(null);
        }, 1000);
      } else {
        setValidationStatus('invalid');
      }
    } catch (error) {
      setValidationStatus('invalid');
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const removeKey = () => {
    setApiKey('');
    onSave('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-blue-500 max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-black text-blue-500 mb-2 flex items-center gap-2">
            <Key size={28} /> API Key Settings
          </h2>
          <p className="text-gray-400">
            Choose between free tier (limited) or your own API key (unlimited)
          </p>
        </div>

        {/* Rate Limit Info */}
        {rateLimitInfo && rateLimitInfo.usingSharedKey && (
          <div className="bg-yellow-500 bg-opacity-10 border-2 border-yellow-500 p-4 mb-6">
            <p className="font-bold text-yellow-500 mb-2">Free Tier Usage</p>
            <p className="text-lg">
              {rateLimitInfo.remaining} / {rateLimitInfo.limit} requests remaining
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Resets in {rateLimitInfo.resetIn} minutes
            </p>
          </div>
        )}

        {rateLimitInfo && rateLimitInfo.rateLimitExceeded && (
          <div className="bg-red-500 bg-opacity-10 border-2 border-red-500 p-4 mb-6">
            <p className="font-bold text-red-500 mb-2">Rate Limit Reached</p>
            <p className="text-gray-300">
              You've used all your free requests. Add your own API key to continue, or wait {rateLimitInfo.resetIn} minutes.
            </p>
          </div>
        )}

        {/* Free Tier Info */}
        <div className="bg-gray-800 p-4 mb-6">
          <h3 className="font-bold text-xl mb-2">Free Tier</h3>
          <ul className="space-y-1 text-gray-300">
            <li>✓ 10 AI requests per hour</li>
            <li>✓ No API key required</li>
            <li>✓ Perfect for trying out the app</li>
          </ul>
        </div>

        {/* Own Key Info */}
        <div className="bg-gray-800 p-4 mb-6">
          <h3 className="font-bold text-xl mb-2 text-green-500">Your Own API Key (Recommended)</h3>
          <ul className="space-y-1 text-gray-300 mb-3">
            <li>✓ Unlimited requests</li>
            <li>✓ Cost: ~$0.01-0.03 per conversation</li>
            <li>✓ Stored only in browser memory (secure)</li>
            <li>✓ Get your key at <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">console.anthropic.com</a></li>
          </ul>
        </div>

        {/* API Key Input */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2">
            Anthropic API Key (Optional)
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setValidationStatus(null);
            }}
            placeholder="sk-ant-..."
            className="w-full bg-gray-800 border-2 border-gray-700 p-3 text-lg font-mono focus:border-blue-500 focus:outline-none"
          />
          <p className="text-sm text-gray-400 mt-2">
            Leave empty to use free tier. Your key stays in memory only (never saved to disk).
          </p>
        </div>

        {/* Validation Status */}
        {validationStatus === 'valid' && (
          <div className="bg-green-500 bg-opacity-10 border-2 border-green-500 p-3 mb-4 flex items-center gap-2">
            <Check size={20} className="text-green-500" />
            <span className="font-bold text-green-500">Valid API key! Saving...</span>
          </div>
        )}

        {validationStatus === 'invalid' && (
          <div className="bg-red-500 bg-opacity-10 border-2 border-red-500 p-3 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            <span className="font-bold text-red-500">Invalid API key. Please check and try again.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={validateAndSave}
            disabled={isValidating}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-3 px-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? 'Validating...' : apiKey.trim() ? 'Validate & Save' : 'Use Free Tier'}
          </button>

          {currentKey && (
            <button
              onClick={removeKey}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6"
            >
              Remove Key
            </button>
          )}

          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6"
          >
            Cancel
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-6 border-t-2 border-gray-700 pt-4">
          <p className="text-xs text-gray-500">
            🔒 <strong>Security:</strong> Your API key is stored only in browser memory and expires when you close the tab. 
            It's never saved to localStorage, cookies, or sent anywhere except directly to Anthropic's API.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
