import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const EmployeeRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Transform skills to array
    const employeeData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      performanceScore: Number(formData.performanceScore),
      experience: Number(formData.experience)
    };

    try {
      await api.post('/employees', employeeData);
      setSuccess('Employee successfully registered!');
      setTimeout(() => navigate('/employees'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-6 text-slate-100">Add New Employee</h1>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg mb-6">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg mb-6">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="john@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
              <select name="department" required value={formData.department} onChange={handleChange} className="input-field bg-slate-800">
                <option value="">Select Department</option>
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Experience (Years)</label>
              <input type="number" name="experience" min="0" required value={formData.experience} onChange={handleChange} className="input-field" placeholder="3" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Skills (Comma separated)</label>
              <input type="text" name="skills" required value={formData.skills} onChange={handleChange} className="input-field" placeholder="React, Node.js, MongoDB" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Performance Score (0-100)</label>
              <input type="number" name="performanceScore" min="0" max="100" required value={formData.performanceScore} onChange={handleChange} className="input-field" placeholder="85" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Bio / Notes (Optional)</label>
              <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} className="input-field resize-none" placeholder="Brief notes about the employee..."></textarea>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
            {loading ? 'Registering...' : 'Register Employee'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmployeeRegistration;
