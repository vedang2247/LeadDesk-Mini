import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';


const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const fetchLeads = useCallback(async () => {
        try {
            const response = await api.get(`/api/leads?search=${search}`);
            setLeads(response.data);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('isAuthenticated');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [search, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLeads();
        }, 300); 
        return () => clearTimeout(timer);
    }, [fetchLeads]);

    const handleStatusChange = async (leadId, newStatus) => {
        try {
            await api.patch(`/api/leads/${leadId}/status`, { status: newStatus });
            setLeads(leads.map(lead => lead._id === leadId ? { ...lead, status: newStatus } : lead));
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout');
            localStorage.removeItem('isAuthenticated');
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const filteredLeads = leads.filter(lead => filter === 'All' || lead.status === filter);

    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
    const closedLeads = leads.filter(l => l.status === 'Closed').length;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">

            {/* Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
                    <p className="text-sm text-slate-500">Track, categorize, and convert incoming B2B business inquiries.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-md text-sm font-medium flex items-center gap-2 self-start sm:self-auto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Total Leads</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalLeads}</p>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">New</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{newLeads}</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Contacted</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{contactedLeads}</p>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Closed</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{closedLeads}</p>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* Search Bar & Filter Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full md:w-96">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </span>
                    <input
                        type="text"
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Search leads by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-xs font-semibold text-slate-500">Filter:</span>
                    {['All', 'New', 'Contacted', 'Closed'].map((statusOption) => (
                        <button
                            key={statusOption}
                            onClick={() => setFilter(statusOption)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === statusOption
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {statusOption}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500 text-sm">Loading leads...</div>
                ) : filteredLeads.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-sm">No leads match your criteria.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3 px-4">Name & Email</th>
                                    <th className="py-3 px-4">Date Submitted</th>
                                    <th className="py-3 px-4">Budget</th>
                                    <th className="py-3 px-4">Message</th>
                                    <th className="py-3 px-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3.5 px-4">
                                            <div className="font-semibold text-slate-900">{lead.name}</div>
                                            <div className="text-xs text-slate-500">{lead.email}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                                            {new Date(lead.createdAt || Date.now()).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-3.5 px-4 font-semibold text-slate-800 text-xs">{lead.budgetRange}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedLead(lead)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none transition-colors"
                                            >
                                                See Description
                                            </button>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <select
                                                value={lead.status || 'New'}
                                                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${lead.status === 'Contacted'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : lead.status === 'Closed'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}
                                            >
                                                <option value="New">● New</option>
                                                <option value="Contacted">● Contacted</option>
                                                <option value="Closed">● Closed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Project Details</h3>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none focus:outline-none"
                                aria-label="Close modal"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body (Scrollable if message is massive) */}
                        <div className="px-6 py-5 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Client Name</span>
                                    <p className="text-slate-900 font-medium">{selectedLead.name}</p>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Budget</span>
                                    <p className="text-slate-900 font-medium">{selectedLead.budgetRange || 'Not specified'}</p>
                                </div>
                            </div>

                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Message</span>
                                {/* whitespace-pre-wrap ensures line breaks from the user's input are respected */}
                                <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm whitespace-pre-wrap border border-slate-100">
                                    {selectedLead.message}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="px-5 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;