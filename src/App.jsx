import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Hero from './Components/Hero';
import Aboutus from './Components/Aboutus';
import OurServices from './Components/OurServices';
import Bookappointment from './Components/Bookappointment';
import Healthcare from './Components/Healthcare';
import Treatments from './Components/Treatments';
import Services from './Components/Services';
import Doctors from './Components/Doctors';
import Available from './Components/Available';
import Contact from './Components/Contact';
import StartDigitalJourney from './Components/StartDigitalJourney';
import SupportandPolicies from './Components/SupportandPolicies';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';
import DoctorNavbar from './Components/Dashboard/Doctor/DoctorNavbar';
import DoctorSidebar from './Components/Dashboard/Doctor/DoctorSidebar';
import Appointments from './Components/Dashboard/Doctor/Appointments';
import MyPatients from './Components/Dashboard/Doctor/MyPatients';
import MedicalRecords from './Components/Dashboard/Doctor/MedicalRecords';
import PrescriptionSection from './Components/Dashboard/Doctor/PrescriptionSection';
import Message from './Components/Dashboard/Doctor/Message';
import Schedule from './Components/Dashboard/Doctor/Schedule';
import Reports from './Components/Dashboard/Doctor/Reports';
import DoctorProfile from './Components/Dashboard/Doctor/DoctorProfile';
import Settings from './Components/Dashboard/Doctor/Settings';
import Logout from './Components/Dashboard/Doctor/Logout';
import PatientNavbar from './Components/Dashboard/Patients/PatientNavbar';
import PatientSidebar from './Components/Dashboard/Patients/PatientSidebar';
import Appointment from './Components/Dashboard/Patients/Appointment';
import PatientMedicalRecords from './Components/Dashboard/Patients/MedicalRecords';
import Prescriptions from './Components/Dashboard/Patients/Prescriptions';
import LiveConsultations from './Components/Dashboard/Patients/LiveConsultations';
import Bills from './Components/Dashboard/Patients/Bills';
import PatientReports from './Components/Dashboard/Patients/Reports';
import MyProfile from './Components/Dashboard/Patients/MyProfile';
import PatientSetting from './Components/Dashboard/Patients/Setting';
import PatientLogout from './Components/Dashboard/Patients/Logout';

const App = () => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="app">
      <Routes>
        {/* Public routes with full layout */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Sidebar />
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Home />
                      <Hero />
                      <OurServices />
                      <Healthcare />
                      <Treatments />
                    </>
                  }
                />
                <Route path="/login" element={<div className="pt-16"><Login /></div>} />
                <Route path="/signup" element={<div className="pt-16"><Signup /></div>} />
                <Route path="/forgetpassword" element={<div className="pt-16"><ForgotPassword /></div>} />
                <Route path="/book-appointment" element={<div className="pt-16"><Bookappointment /></div>} />
                <Route path="/book-appointment/:specialty/:doctorId" element={<div className="pt-16"><Bookappointment /></div>} />
                <Route path="/services" element={<div className="pt-16"><Services /></div>} />
                <Route path="/doctors" element={<div className="pt-16"><Doctors /></div>} />
                <Route path="/available/:specialty" element={<div className="pt-16"><Available /></div>} />
                <Route path="/contact" element={<div className="pt-16"><Contact /></div>} />
                <Route path="/about" element={<div className="pt-16"><Aboutus /></div>} />
                <Route path="/startdigitaljourney" element={<div className="pt-16"><StartDigitalJourney /></div>} />
                <Route path="/working-hours" element={<div className="pt-16"><SupportandPolicies section="working-hours" /></div>} />
                <Route path="/terms" element={<div className="pt-16"><SupportandPolicies section="terms" /></div>} />
                <Route path="/privacy" element={<div className="pt-16"><SupportandPolicies section="privacy" /></div>} />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* Doctor dashboard routes */}
        <Route
          path="/doctor/*"
          element={
            <div className="min-h-screen flex flex-col">
              <DoctorNavbar />
              <div className="flex flex-1 pt-16">
                <DoctorSidebar 
                  onCollapse={setIsSidebarCollapsed} 
                  initiallyCollapsed={isSidebarCollapsed}
                />
                <main className={`flex-1 p-4 sm:p-6 bg-gray-100 transition-all duration-300 ${
                  isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
                }`}>
                  <Routes>
                    <Route index element={<Navigate to="appointments" replace />} />
                    <Route path="dashboard" element={<Navigate to="appointments" replace />} />
                    <Route path="appointments" element={<Appointments />} />
                    <Route path="patients" element={<MyPatients />} />
                    <Route path="records" element={<MedicalRecords />} />
                    <Route path="prescriptions" element={<PrescriptionSection />} />
                    <Route path="messages" element={<Message />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="profile" element={<DoctorProfile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="logout" element={<Logout />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />

        {/* Patient dashboard routes */}
        <Route
          path="/patient/*"
          element={
            <div className="flex flex-col min-h-screen">
              <PatientNavbar />
              <div className="flex flex-1 pt-16">
                <PatientSidebar 
                  onCollapse={setIsSidebarCollapsed} 
                  initiallyCollapsed={isSidebarCollapsed}
                />
                <main className={`flex-1 overflow-auto p-4 transition-all duration-300 ${
                  isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
                }`}>
                  <Routes>
                    <Route index element={<Navigate to="appointments" replace />} />
                    <Route path="appointments" element={<Appointment />} />
                    <Route path="medical-records" element={<PatientMedicalRecords />} />
                    <Route path="prescriptions" element={<Prescriptions />} />
                    <Route path="live-consultations" element={<LiveConsultations />} />
                    <Route path="bills" element={<Bills />} />
                    <Route path="reports" element={<PatientReports />} />
                    <Route path="profile" element={<MyProfile />} />
                    <Route path="settings" element={<PatientSetting />} />
                    <Route path="logout" element={<PatientLogout />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />

        {/* Other role routes */}
        {[
          '/super-admin', '/accountant', '/case-handler', 
          '/receptionist', '/pharmacist', '/lab-technician',
          '/nurse', '/hr-manager'
        ].map(route => (
          <Route 
            key={route} 
            path={`${route}/*`} 
            element={
              <div className="min-h-screen p-4">
                <h1 className="text-2xl font-bold">Dashboard for {route.substring(1).replace('-', ' ')}</h1>
                <div className="mt-4 p-4 bg-white rounded-lg shadow">
                  <p>This dashboard is under development</p>
                </div>
              </div>
            } 
          />
        ))}
      </Routes>
    </div>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;