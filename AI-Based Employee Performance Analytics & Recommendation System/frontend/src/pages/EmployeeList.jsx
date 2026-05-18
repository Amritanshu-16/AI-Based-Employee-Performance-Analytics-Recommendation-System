import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Search, Filter, Trash2, Edit2 } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (error) {
        console.error('Error deleting employee', error);
      }
    }
  };

  const handleUpdateScore = async (id, currentScore) => {
    const newScore = window.prompt('Enter new performance score (0-100):', currentScore);
    if (newScore !== null && newScore.trim() !== '' && !isNaN(newScore)) {
      const score = Number(newScore);
      if (score >= 0 && score <= 100) {
        try {
          const { data } = await api.put(`/employees/${id}`, { performanceScore: score });
          setEmployees(employees.map(emp => emp._id === id ? data : emp));
        } catch (error) {
          console.error('Error updating score', error);
          alert('Failed to update score');
        }
      } else {
        alert('Score must be between 0 and 100');
      }
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = departmentFilter ? emp.department === departmentFilter : true;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Employee Directory</h1>
          <p className="text-slate-400">Manage and view all registered employees</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search name or skills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="relative w-48">
            <Filter className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="input-field pl-10 appearance-none bg-slate-800"
            >
              <option value="">All Departments</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp, index) => (
            <motion.div 
              key={emp._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 relative group"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => handleUpdateScore(emp._id, emp.performanceScore)} className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/40" title="Update Score">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(emp._id)} className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40" title="Delete Employee">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{emp.name}</h3>
                  <p className="text-xs text-slate-400">{emp.department} • {emp.experience} Yrs Exp</p>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Performance Score</span>
                    <span className="font-medium text-slate-200">{emp.performanceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${emp.performanceScore >= 80 ? 'bg-green-500' : emp.performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${emp.performanceScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {emp.skills.slice(0, 4).map((skill, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {skill}
                      </span>
                    ))}
                    {emp.skills.length > 4 && <span className="px-2 py-1 text-xs rounded-md bg-slate-700 text-slate-300">+{emp.skills.length - 4}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredEmployees.length === 0 && (
            <div className="col-span-full py-12 text-center glass-card">
              <p className="text-slate-400">No employees found matching your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
