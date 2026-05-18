import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Star, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card p-6 flex items-center gap-4"
  >
    <div className={`p-4 rounded-xl bg-${color}-500/20 text-${color}-400`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchEmployees();
  }, []);

  if (loading) return <div className="animate-pulse flex gap-4"><div className="h-32 w-1/4 bg-slate-800 rounded-xl"></div></div>;

  // Stats calculation
  const totalEmployees = employees.length;
  const highPerformance = employees.filter(e => e.performanceScore >= 80).length;
  const avgPerformance = totalEmployees > 0 
    ? Math.round(employees.reduce((acc, curr) => acc + curr.performanceScore, 0) / totalEmployees) 
    : 0;
  const promotionEligible = employees.filter(e => e.performanceScore >= 85 && e.experience >= 2).length;

  // Department distribution
  const deptMap = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
  const deptData = Object.keys(deptMap).map(key => ({ name: key, value: deptMap[key] }));
  const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  // Performance data
  const perfData = employees.map(emp => ({
    name: emp.name.split(' ')[0],
    score: emp.performanceScore
  })).slice(0, 10); // Top 10 for bar chart

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Overview Analytics</h1>
        <p className="text-slate-400">Welcome to the HR performance dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Employees" value={totalEmployees} icon={Users} color="blue" />
        <DashboardCard title="High Performers" value={highPerformance} icon={Star} color="yellow" />
        <DashboardCard title="Avg Score" value={`${avgPerformance}%`} icon={TrendingUp} color="green" />
        <DashboardCard title="Promotion Eligible" value={promotionEligible} icon={Award} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4 text-slate-200">Department Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {deptData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4 text-slate-200">Recent Employee Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="score" fill="url(#colorScore)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
