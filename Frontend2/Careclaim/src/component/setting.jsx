<<<<<<< HEAD
import React from 'react';
import { User, Bell, Shield, CreditCard, Settings, FileText, BarChart3, List, Plus } from 'lucide-react';

const SettingsPage = () => {
=======
import React, { useState } from 'react';
import Header from './Header';
import { User, Bell, Shield, CreditCard, Settings, BarChart3 } from 'lucide-react';

const SettingsPage = () => {
  const [currentPage, setCurrentPage] = useState('settings');
>>>>>>> 024cb20 (feat: setup of auth and database)
  const settingsCards = [
    { title: 'Profile Settings', description: 'Manage your personal information and preferences', icon: User, color: 'slate' },
    { title: 'Notifications', description: 'Configure email and push notification preferences', icon: Bell, color: 'green' },
    { title: 'Security', description: 'Password, two-factor authentication, and security settings', icon: Shield, color: 'slate' },
    { title: 'Billing', description: 'Payment methods and subscription management', icon: CreditCard, color: 'green' }
  ];

  const getIconStyles = (color) => {
    const styles = {
      green:  { bg: 'bg-green-100', text: 'text-green-600' },
      slate:  { bg: 'bg-slate-100', text: 'text-slate-600' },
    };
    return styles[color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
<<<<<<< HEAD
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center shadow-inner shadow-slate-900/20">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-semibold text-gray-900">CareClaim</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                <span>Submit Claim</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <List className="w-4 h-4" />
                <span>My Claims</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center ring-2 ring-gray-200">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <span className="text-gray-800 hidden sm:inline font-medium">John Doe</span>
          </div>
        </div>
      </nav>
=======
      <Header currentPage={currentPage} />
>>>>>>> 024cb20 (feat: setup of auth and database)

      {/* Main Content */}
      <main className="px-6 md:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-lg text-gray-500">Manage your account and application preferences.</p>
          </div>

          {/* Settings Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {settingsCards.map((card) => {
              const Icon = card.icon;
              const styles = getIconStyles(card.color);
              return (
                <div key={card.title} className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${styles.bg}`}>
                      <Icon className={`w-6 h-6 ${styles.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-slate-700 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coming Soon Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-12 sm:p-16 text-center shadow-lg">
             <div className="mb-8">
               <div className="w-28 h-28 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center mx-auto shadow-lg">
                 <Settings className="w-14 h-14 text-white" />
               </div>
             </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">More Settings Coming Soon</h2>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Detailed panels for profile management, security, and notifications are currently in development.
            </p>
            <button className="flex items-center justify-center mx-auto space-x-2 bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                <BarChart3 className="w-5 h-5" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
