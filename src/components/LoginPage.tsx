import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { userService } from '../services/apiService';
import { validateGmailEmail, normalizeGmailEmail } from '../utils/emailValidation';

interface LoginPageProps {
  onBack: () => void;
  onShowSignup: () => void;
  onLoginSuccess: () => void;
}


import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onShowSignup, onLoginSuccess }) => {
  const { setUser, setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Validate Gmail email
    const emailValidation = validateGmailEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email format');
      setLoading(false);
      return;
    }

    try {
      // Normalize email before sending to backend
      const normalizedEmail = normalizeGmailEmail(email);
      const result = await userService.login({ email: normalizedEmail, password });
      
      if (result.success && result.data) {
        // Convert ApiUser to User format expected by AuthContext
        const userData = {
          ...result.data,
          password: '', // Don't store password
          createdAt: new Date(), // Set current date as fallback
        };
        localStorage.setItem('petlove_user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(result.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-3 p-1 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Login</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              placeholder="Enter Gmail address (xyz@gmail.com)"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Only Gmail accounts are accepted (e.g., yourname@gmail.com)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500 pr-10"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            onClick={onShowSignup}
            className="text-orange-500 hover:text-orange-600"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
