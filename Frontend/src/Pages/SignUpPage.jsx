import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate for navigation
import { Eye, EyeOff, Mail, User, Lock, Loader2, MessageSquare } from 'lucide-react'; // Optional, for showing password toggle
import { motion } from 'framer-motion'; // Import Framer Motion
import { useAuth } from '../lib/useAuth';
import { AuthImagePattern } from '../Components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const navigate = useNavigate(); // For navigation to login page ##REMOVE LATER
  const{ signup, isSignUp } = useAuth();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error('Username is required');
    if(!formData.email.trim()) return toast.error('Email is required');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error('Wrong email format');
    if(!formData.password) return toast.error('Password is required');
    if (formData.password.length < 8) return toast.error('Password must be at least 8 character long');
    return true;
  }; //Already using required attribute in all 3 containers

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
    // You can add form validation and API submission here
    const success = validateForm();

    if(success) {
      signup(formData);
      console.log('Form Data:', formData);
    };
    // Navigate to the login page after successful signup
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-custom-dark-blue max-w-4xl p-8 rounded-lg shadow-lg w-full mx-auto h-screen overflow-hidden "> 
        <div className='flex flex-row md:flex-row justify-center items-center p-6 '>
          <div className='w-full max-w-md space-y-8 flex-1'>
            <div className='text-center mb-8'>
              <div className='flex flex-col items-center p-6 sm:p12'>
               <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
               <MessageSquare className='size-6 text-primary' />
                </div>
               <h2 className="text-2xl font-semibold pt-3 text-center mb-6">Create Your Account</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
             {/* Name Input */}
             <div className='form-control relative'>
               <label htmlFor="name" className="label block text-sm font-medium text-gray-700">Username</label>
               <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='size-5  pt-1 text-base-content/40'/>
                  </div>
                <input
                  id="name"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 pl-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 leading-1"
                  placeholder="Enter your name"
                  />
                </div>
              </div>

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
                disabled={isSignUp} > 
                  {isSignUp ? (
                    <>
                      <Loader2 className='size-5 animate-spin'/>
                      Loading...
                    </>
                    ) : (
                      "Create Account"
                    )
                  }            
              </button>
              </form>

           {/* Navigate to Login page */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>

         {/*Probable right side */}
         <div className='hidden md:flex flex-1'>
            <AuthImagePattern/>
         </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupPage;


// const SignUpPage = () => {
//   return (
//     <div>SignUpPage</div>
//   )
// }

// export default SignUpPage