import { React, useEffect, useTransition } from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import { useLocation, Outlet } from "react-router-dom";
import {motion, AnimatePresence } from "framer-motion";
import {  Loader2 } from "lucide-react";

import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import SignupPage from "./Pages/SignUpPage";
import SettingsPage from "./Pages/SettingsPage";
import { useAuth } from "./lib/useAuth";
import { Toaster } from "react-hot-toast";


const pageVariants = {
  initial: { 
    opacity: 0, 
    x: "-100%" 
  },
  in: { 
    opacity: 1, 
    x: 0 
  },
  out: { 
    opacity: 0, 
    x: "100%" 
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const App = () => {
  const location = useLocation(); 
  const pathname = location.pathname;

  const {authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuth();

  console.log({onlineUsers});
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser) return(
    <div className="flex items-center justify-center h-screen">
      <Loader2 className = "size-10 animate-spin"/>
    </div>
  )

  // const transition = useTransition(location, {
  //   key: pathname, // Use pathname for unique key
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  //   duration: 0.5, // Or your desired animation duration
  // });

  return (
    <div >
      <Navbar/>    
        <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route 
          path="/" 
          element={ 
            authUser ? (
              <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <HomePage />
                </motion.div>
              ) : (
            <Navigate to = '/login' />
            )
            } 
            />

          <Route 
          path="/signup" 
          element={ 
            !authUser ? (
              <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SignupPage />
            </motion.div>
          ) : (            
          <Navigate to = '/' />
            )
            } 
            />

          <Route 
          path="/login" 
          element={ 
            !authUser ? (
              <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <LoginPage />
            </motion.div>
          ) : (
            <Navigate to = '/' />
          )
            } 
            />

          <Route 
          path="/settings" 
          element={
            authUser ? (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SettingsPage />
                </motion.div>
              ) : (

            <Navigate to = '/login'/>
              )
            } 
            />

          <Route 
          path="/profile" 
          element={
            authUser ? (
            <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ProfilePage />
          </motion.div>
        ) : (            
        <Navigate to = '/login' />
        )
            } 
            />

        </Routes>
        <Outlet />
        </AnimatePresence>
      <Toaster/>
    </div>
  )
};

export default App;
