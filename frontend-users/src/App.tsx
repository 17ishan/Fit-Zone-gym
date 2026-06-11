import './App.css';
import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarWrapper from "@/components/NavbarWrapper";
import { LazyLoadingSection } from '@/components/LoadingSpinner';
import { AuthProvider } from "@/auth/AuthContext";
import { ProtectedRoute } from "@/auth/ProtectedRoute";

// Lazy load components
const HeroSection = lazy(() => import("@/components/HeroSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const ServiceSection = lazy(() => import("@/components/ServiceSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const MembershipSection = lazy(() => import("@/components/MembershipSection"));
const GallerySection = lazy(() => import("@/components/GallerySection"));
const BMIcalculator = lazy(() => import("@/components/BMIcalculator"));
const JoinNow = lazy(() => import("@/components/JoinNow"));
const ExploreMore = lazy(() => import("@/components/ExploreMore"));
const LoginPage = lazy(() => import("@/components/LoginPage"));
const ResetPasswordPage = lazy(() => import("@/components/ResetPasswordPage"));
const Footer = lazy(() => import('./components/Footer'));
const AIChat = lazy(() => import("@/components/AIChat"));
// import Chatbot from './components/Chatbot';

// Member portal (authenticated)
const DashboardLayout = lazy(() =>
  import("@/components/dashboard/DashboardLayout").then((m) => ({ default: m.DashboardLayout }))
);
const OverviewPage = lazy(() => import("@/pages/dashboard/OverviewPage"));
const MembershipPage = lazy(() => import("@/pages/dashboard/MembershipPage"));
const BillingPage = lazy(() => import("@/pages/dashboard/BillingPage"));
const ProfilePage = lazy(() => import("@/pages/dashboard/ProfilePage"));

function App() {
  return (
    <AuthProvider>
    <Router >
      <div className="relative z-0 min-h-screen font-serif ">
        <NavbarWrapper />
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              <>
                {/* Hero Section */}
                <div id='home'>
                  <LazyLoadingSection>
                    <HeroSection />
                  </LazyLoadingSection>
                </div>

                {/* Service Section */}
                <div id='service'>
                  <LazyLoadingSection>
                    <ServiceSection />
                  </LazyLoadingSection>
                </div>

                <div>
                  <LazyLoadingSection>
                    <BMIcalculator/> 
                  </LazyLoadingSection>
                </div>

                {/* About Section */}
                <div id='about'>
                  <LazyLoadingSection>
                    <AboutSection />
                  </LazyLoadingSection>
                </div>

                {/* Membership Section */}
                <div id='membership'>
                  <LazyLoadingSection>
                    <MembershipSection />
                  </LazyLoadingSection>
                </div>

                {/* Gallery Section */}
                <div id='gallery'>
                  <LazyLoadingSection>
                    <GallerySection />
                  </LazyLoadingSection>
                </div>
                
                {/* Contact Section */}
                <div id='contact'>
                  <LazyLoadingSection>
                    <ContactSection />
                  </LazyLoadingSection>
                </div>

                {/* AI Chat Section */}
                <div id="aichat">
                  <LazyLoadingSection>
                    <AIChat/>
                  </LazyLoadingSection>
                </div>

                {/* Footer section */}
                <div id="footer">
                  <LazyLoadingSection>
                    <Footer/>
                  </LazyLoadingSection>
                </div>
              </>
            }
          />

          {/* New Pages */}
          <Route path="/join" element={<LazyLoadingSection><JoinNow /></LazyLoadingSection>} />
          <Route path="/explore" element={<LazyLoadingSection><ExploreMore /></LazyLoadingSection>} />
          <Route path="/login" element={<LazyLoadingSection><LoginPage /></LazyLoadingSection>} />
          <Route path="/reset-password" element={<LazyLoadingSection><ResetPasswordPage /></LazyLoadingSection>} />

          {/* Member portal (authenticated) */}
          <Route
            element={
              <ProtectedRoute>
                <LazyLoadingSection><DashboardLayout /></LazyLoadingSection>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<LazyLoadingSection><OverviewPage /></LazyLoadingSection>} />
            <Route path="/dashboard/membership" element={<LazyLoadingSection><MembershipPage /></LazyLoadingSection>} />
            <Route path="/dashboard/billing" element={<LazyLoadingSection><BillingPage /></LazyLoadingSection>} />
            <Route path="/dashboard/profile" element={<LazyLoadingSection><ProfilePage /></LazyLoadingSection>} />
          </Route>
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
