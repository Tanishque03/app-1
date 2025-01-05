import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link to navigate to signup page
import { motion } from 'framer-motion'; // Import Framer Motion for animations
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react'; // Optional, for password visibility toggle
import { AuthImagePattern } from '../Components/AuthImagePattern';
import { useAuth } from '../lib/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const { login, isLoggingIn} = useAuth();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
    console.log('Login Form Data:', formData);
    // Add login logic (e.g., authentication with API)
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-custom-dark-blue max-w-4xl p-8 rounded-lg shadow-lg w-full mx-auto h-screen overflow-hidden">
        <div className='flex flex-col md:flex-row justify-center items-center p-6 '>
          <div className='w-full max-w-md space-y-8 flex-1 md:mr-4'>
            <div className='text-center mb-8'>
              <div className='flex flex-col items-center p-6 sm:p12'>
                <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
                </div>
                <h2 className="text-2xl font-semibold pt-3 text-center mb-6">Login to Your Account</h2>
              </div>
            </div>


            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='size-5 pt-1 text-base-content/40'/>
                  </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='size-5 pt-1 text-base-content/40'/>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                    />
                  {/* Password Toggle */}
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled = {isLoggingIn} > 
                {isLoggingIn ? (
                  <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  Loading.
                  </>
                  ) : (
                    "Log In"
                )}
                
              </button>
            </form>

            {/* Navigate to Signup page */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Sign Up here
                </Link>
              </p>
            </div>
          </div>

          <div className='hidden md:flex flex-1'>
            <AuthImagePattern/>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;

