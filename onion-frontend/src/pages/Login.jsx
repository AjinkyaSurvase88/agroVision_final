import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/dashboard');
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
              <span className="text-2xl">🚜</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-forest-900 mb-2">शेतकऱ्याचे स्वागत!</h1>
            <p className="text-sm font-sans text-gray-500">आपल्या खाते मध्ये प्रवेश करा</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-sans text-red-700">{error}</p>
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
                placeholder="आपले वापरकर्ता नाव टाइप करा"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all disabled:opacity-50"
                required
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
                  placeholder="आपला पासवर्ड टाइप करा"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all disabled:opacity-50"
                  required
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full mt-6 bg-forest-600 hover:bg-forest-700 disabled:bg-gray-300 text-white font-sans font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  लोड हो रहा है...
                </>
              ) : (
                '✓ प्रवेश करा'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-sans text-gray-400">किंवा</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm font-sans text-gray-600">
            नवीन खाते नाही?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-forest-600 font-semibold hover:underline"
            >
              नंतर साइन अप करा
            </button>
          </p>

          {/* Anonymous note */}
          <div className="mt-6 p-4 bg-forest-50 border border-forest-200 rounded-xl">
            <p className="text-xs font-sans text-forest-700 text-center">
              💡 <strong>सुचना:</strong> साइन इन न करून देखील प्रतिमांचे विश्लेषण करू शकता. साइन इन केल्यास इतिहास सांभाळला जाईल.
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

export default Login;
