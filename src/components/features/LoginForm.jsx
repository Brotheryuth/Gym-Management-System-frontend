import React, { useState } from 'react';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import BackendStatusMascot from '../ui/BackendStatusMascot';
import { formatErrorMessage } from '../../utils/errorFormatter';

export default function LoginForm({ onLogin, onBypass, isLoading: globalLoading, error: globalError, backendStatus, onRetryBackend }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (validationError || localError) {
      setValidationError('');
      setLocalError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (validationError || localError) {
      setValidationError('');
      setLocalError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setLocalError('');

    if (!username.trim() || !password.trim()) {
      setValidationError('Please fill in all credential fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onLogin(username.trim(), password.trim());
    } catch (err) {
      const formatted = formatErrorMessage(err);
      setLocalError(formatted || 'Invalid cashier identifier or security password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = validationError || localError || globalError;
  const isLoading = isSubmitting;

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <BackendStatusMascot status={backendStatus} onRetry={onRetryBackend} />
        <Card className="login-card">
          <form onSubmit={handleSubmit}>
            <div className="login-branding">
              <div className="login-logo">G</div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 4px', letterSpacing: '-0.5px' }}>
                Gym<span>Management</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Cashier Terminal Portal</p>
            </div>

            {activeError && (
              <div style={{
                backgroundColor: 'var(--color-error-bg)',
                border: '1.5px solid var(--color-error)',
                color: 'var(--color-error)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13.5px',
                fontWeight: 600,
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {activeError}
              </div>
            )}

            <InputField
              label="Cashier Identifier"
              placeholder="Enter admin or staff ID"
              value={username}
              onChange={handleUsernameChange}
              disabled={isLoading}
            />

            <InputField
              label="Security Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
            />

            <Button
              type="submit"
              loading={isLoading}
              style={{ marginTop: '12px' }}
            >
              Authenticate Shift
            </Button>

            {onBypass && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', width: '100%' }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onBypass('ADMIN')}
                  disabled={isLoading}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '13px', minHeight: '38px' }}
                >
                  Bypass Admin
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onBypass('STAFF')}
                  disabled={isLoading}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '13px', minHeight: '38px' }}
                >
                  Bypass Staff
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
