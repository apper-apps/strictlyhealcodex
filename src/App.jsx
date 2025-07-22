import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SEOLandingPage from "@/components/pages/SEOLandingPage";
import Layout from "@/components/organisms/Layout";
import IndustryDetail from "@/components/pages/IndustryDetail";
import Industries from "@/components/pages/Industries";
import Services from "@/components/pages/Services";
import Contact from "@/components/pages/Contact";
import Home from "@/components/pages/Home";
import About from "@/components/pages/About";
import Resources from "@/components/pages/Resources";
import ServiceDetail from "@/components/pages/ServiceDetail";
import CaseStudies from "@/components/pages/CaseStudies";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
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
    </>
  );
}

export default App;