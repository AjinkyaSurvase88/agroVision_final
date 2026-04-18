import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('सर्व फील्ड भरा');
      return false;
    }
    if (username.length < 3) {
      setError('वापरकर्ता नाव किमान 3 अक्षरे असावे');
      return false;
    }
    if (!email.includes('@')) {
      setError('वैध ईमेल पत्ता द्या');
      return false;
    }
    if (password.length < 6) {
      setError('पासवर्ड किमान 6 अक्षरे असावे');
      return false;
    }
    if (password !== confirmPassword) {
      setError('पासवर्ड जुळत नाहीत');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    const result = await register(username, email, password);
    
    if (result.success) {
      setSuccess('खाता यशस्वीरित्या तयार झाला! आता लॉगिन करा.');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-forest-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-forest-100 p-8 animate-fade-in">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-forest-100 rounded-2xl mb-4">
              <span className="text-2xl">👨‍🌾</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-forest-900 mb-2">नव्याने सुरुवात करा</h1>
            <p className="text-sm font-sans text-gray-500">आपले AgroVision खाते तयार करा</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-sans text-red-700">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-6 p-3.5 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm font-sans text-green-700">✓ {success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-sans font-semibold text-gray-700 mb-2">
                वापरकर्ता नाव
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="एक अनन्य नाव निवडा"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-sans font-semibold text-gray-700 mb-2">
                ईमेल पत्ता
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="आपला ईमेल द्या"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-sans font-semibold text-gray-700 mb-2">
                पासवर्ड
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="एक मजबूत पासवर्ड तयार करा"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-sans font-semibold text-gray-700 mb-2">
                पासवर्ड पुष्टी करा
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="पासवर्ड पुन्हा टाइप करा"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-forest-600 hover:bg-forest-700 disabled:bg-gray-300 text-white font-sans font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  तयार हो रहा है...
                </>
              ) : (
                '✓ साइन अप करा'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-sans text-gray-400">किंवा</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm font-sans text-gray-600">
            आधीच खाते आहे?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-forest-600 font-semibold hover:underline"
            >
              लॉगिन करा
            </button>
          </p>

          {/* Anonymous note */}
          <div className="mt-6 p-4 bg-forest-50 border border-forest-200 rounded-xl">
            <p className="text-xs font-sans text-forest-700 text-center">
              💡 <strong>सुचना:</strong> खाते साइन अप न करून देखील सर्व वैशिष्ट्ये वापरू शकता!
            </p>
          </div>
        </div>

        {/* Continue anonymous button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-forest-600 font-sans font-medium hover:underline text-sm"
          >
            ← अनाधिकृत वापरकर्ता म्हणून परत जा
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
