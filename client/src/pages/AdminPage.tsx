import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Lock, Users, MessageSquare, TrendingUp } from 'lucide-react';
import type { Lead } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function AdminPage() {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/leads`, {
        headers: { 'x-admin-token': token }
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data = await response.json();
      setLeads(data.leads);
      setStats(data.stats);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Invalid admin token');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(l => l.industryKey === filter);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 font-sans">
      <Header />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-900">
                <Lock size={24} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter admin token..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-neutral-900 text-white font-medium py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'View Leads'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <button 
                onClick={() => { setIsAuthenticated(false); setToken(''); }}
                className="text-sm text-neutral-500 hover:text-neutral-900"
              >
                Log Out
              </button>
            </div>

            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><MessageSquare size={24} /></div>
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">Total Conversations</p>
                    <p className="text-2xl font-bold">{stats.totalConversations}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Users size={24} /></div>
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">Total Leads Captured</p>
                    <p className="text-2xl font-bold">{stats.totalLeadsCaptured}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={24} /></div>
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">Conversion Rate</p>
                    <p className="text-2xl font-bold">{stats.bookingConversionRate}%</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                <h2 className="font-semibold text-lg">Lead Database</h2>
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white border border-neutral-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-neutral-900"
                >
                  <option value="all">All Industries</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="salon">Salon</option>
                  <option value="dental">Dental</option>
                  <option value="gym">Gym</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-neutral-500 uppercase bg-neutral-50/50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-4 font-medium">Industry</th>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Contact</th>
                      <th className="px-6 py-4 font-medium">Intent</th>
                      <th className="px-6 py-4 font-medium">Date/Time Details</th>
                      <th className="px-6 py-4 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((l) => (
                      <tr key={l._id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                        <td className="px-6 py-4 capitalize font-medium">{l.industryKey}</td>
                        <td className="px-6 py-4">{l.name || '—'}</td>
                        <td className="px-6 py-4">
                          <div>{l.phone || '—'}</div>
                          <div className="text-neutral-400 text-xs">{l.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 capitalize">
                          <span className="px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
                            {l.intent}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-600">
                          {l.preferredDateTime || l.requestedService || '—'}
                        </td>
                        <td className="px-6 py-4 text-neutral-400 whitespace-nowrap">
                          {new Date(l.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                          No leads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
