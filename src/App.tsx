import React, { useState } from 'react';
import { FileText, Users, Shield, Phone, Mail, MapPin } from 'lucide-react';
import GrievanceModal from './components/GrievanceModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">GrievancePortal</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Voice Matters
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A secure and transparent platform to lodge grievances and ensure your concerns are heard and addressed promptly.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Lodge Grievance
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our Platform?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <FileText className="h-12 w-12 text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Easy Submission</h4>
            <p className="text-gray-600">
              Submit your grievances with our user-friendly form, including voice input and file attachments.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Secure & Confidential</h4>
            <p className="text-gray-600">
              Your information is protected with enterprise-grade security and handled with complete confidentiality.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Multiple Channels</h4>
            <p className="text-gray-600">
              Choose from NGOs, Labor Officers, or Internal Committees based on your specific needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Need Immediate Help?</h3>
            <p className="text-gray-600">Contact us directly through these channels</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
              <p className="text-gray-600">support@grievanceportal.com</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Visit Us</h4>
              <p className="text-gray-600">123 Justice Street, Legal District</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 GrievancePortal. All rights reserved.</p>
        </div>
      </footer>

      {/* Grievance Modal */}
      <GrievanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default App;