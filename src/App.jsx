import React, { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "@/index.css";
import { clearUser, setUser } from "@/store/userSlice";
import ServiceDetail from "@/components/pages/ServiceDetail";
import BlogDetail from "@/components/pages/BlogDetail";
import Login from "@/components/pages/Login";
import PromptPassword from "@/components/pages/PromptPassword";
import Industries from "@/components/pages/Industries";
import IndustryDetail from "@/components/pages/IndustryDetail";
import ErrorPage from "@/components/pages/ErrorPage";
import BlogList from "@/components/pages/BlogList";
import SEOLandingPage from "@/components/pages/SEOLandingPage";
import About from "@/components/pages/About";
import Signup from "@/components/pages/Signup";
import Resources from "@/components/pages/Resources";
import Home from "@/components/pages/Home";
import Callback from "@/components/pages/Callback";
import Contact from "@/components/pages/Contact";
import Services from "@/components/pages/Services";
import ResetPassword from "@/components/pages/ResetPassword";
import CaseStudies from "@/components/pages/CaseStudies";
import BlogEditor from "@/components/pages/BlogEditor";
import Layout from "@/components/organisms/Layout";

// Create auth context
export const AuthContext = createContext(null);

function AppComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        const isAdminRoute = currentPath.startsWith('/admin');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          // Only redirect to login for admin routes or auth pages
          if (isAdminRoute) {
            navigate(`/login?redirect=${currentPath}`);
          } else if (isAuthPage) {
            if (redirectPath) {
              if (
                !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
              ) {
                navigate(`/login?redirect=${redirectPath}`);
              } else {
                navigate(currentPath);
              }
            } else {
              navigate(currentPath);
            }
          }
          // For public routes, don't redirect - let them stay on the page
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);// No props and state should be bound
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }
  
// Protected Route component for admin routes
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);
    const location = window.location.pathname + window.location.search;
    
    if (!isAuthenticated) {
      return <Login />;
    }
    
    return children;
  };

  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        {/* Auth Routes - Always accessible */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        
        {/* Public Routes - No authentication required */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:serviceId" element={<ServiceDetail />} />
          <Route path="seo-for-chiropractors" element={<SEOLandingPage />} />
          <Route path="seo-for-naturopathic-doctors" element={<SEOLandingPage />} />
          <Route path="functional-medicine-seo" element={<SEOLandingPage />} />
          <Route path="physical-therapy-seo" element={<SEOLandingPage />} />
          <Route path="yoga-pilates-studio-seo" element={<SEOLandingPage />} />
          <Route path="seo-for-hrt-clinics" element={<SEOLandingPage />} />
          <Route path="industries" element={<Industries />} />
          <Route path="industries/:industryId" element={<IndustryDetail />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="contact" element={<Contact />} />
          <Route path="resources" element={<Resources />} />
          <Route path="resources/:blogId" element={<Resources />} />
          <Route path="about" element={<About />} />
        </Route>
        
        {/* Admin Routes - Authentication required */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<BlogList />} />
          <Route path="cms" element={<BlogList />} />
          <Route path="cms/create" element={<BlogEditor />} />
          <Route path="cms/edit/:blogId" element={<BlogEditor />} />
          <Route path="cms/blog/:blogId" element={<BlogDetail />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </AuthContext.Provider>
  );
}

export default AppComponent;