import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Users, DollarSign, FileText, Settings, LayoutDashboard, Bell, TrendingUp, UserCheck, Clock } from 'lucide-react';
import { EmployeePage } from './components/EmployeePage';
import { PayrollPage } from './components/PayrollPage';
import { ReportsPage } from './components/ReportsPage';

function Dashboard({ employees }: { employees: any[] }) {
  const active = employees.filter(e => e.status === 'Active').length;
  const totalSalary = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back 👋</h2>
        <p className="text-gray-500 mt-1">Here's what's happening with your payroll today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: employees.length, icon: Users, color: 'blue', change: 'All staff' },
          { label: 'Active Employees', value: active, icon: UserCheck, color: 'green', change: 'Currently active' },
          { label: 'Monthly Payroll', value: `$${totalSalary.toLocaleString()}`, icon: DollarSign, color: 'purple', change: 'Total salaries' },
          { label: 'Departments', value: '6', icon: TrendingUp, color: 'orange', change: 'Active departments' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Employees</h3>
          {employees.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No employees yet. Add your first employee!</p>
          ) : (
            <div className="space-y-3">
              {employees.slice(0, 5).map((emp, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {emp.first_name?.[0]}{emp.last_name?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{emp.first_name} {emp.last_name}</p>
                    <p className="text-xs text-gray-500">{emp.designation || 'No position'}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {emp.status || 'Active'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Employee', color: 'bg-blue-600 hover:bg-blue-700', icon: Users },
              { label: 'Run Payroll', color: 'bg-green-600 hover:bg-green-700', icon: DollarSign },
              { label: 'View Reports', color: 'bg-purple-600 hover:bg-purple-700', icon: FileText },
              { label: 'Pending Tasks', color: 'bg-orange-500 hover:bg-orange-600', icon: Clock },
            ].map((action) => (
              <button key={action.label} className={`${action.color} text-white rounded-lg p-3 text-sm font-medium flex items-center gap-2 transition-colors`}>
                <action.icon className="w-4 h-4" />{action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Settings</h3>
      <p className="text-gray-500 text-sm mb-6">Manage your payroll system preferences.</p>
      <div className="space-y-4">
        {[
          { label: 'Company Name', value: 'My Company Ltd', type: 'text' },
          { label: 'Currency', value: 'USD', type: 'text' },
          { label: 'Pay Cycle', value: 'Monthly', type: 'text' },
        ].map(field => (
          <div key={field.label}>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{field.label}</label>
            <input defaultValue={field.value} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        ))}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors mt-2">
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const fetchData = () => {
    supabase.from('employees').select('*, departments(id, name)').then(({ data }) => setEmployees(data || []));
    supabase.from('departments').select('*').then(({ data }) => setDepartments(data || []));
  };

  useEffect(() => { fetchData(); }, []);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'employees', icon: Users, label: 'Employees' },
    { id: 'payroll', icon: DollarSign, label: 'Payroll' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">PayrollPro</h1>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentPage === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 capitalize">{currentPage}</h2>
            <p className="text-xs text-gray-400">Payroll Management System</p>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-500" />
          </button>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {currentPage === 'dashboard' && <Dashboard employees={employees} />}
          {currentPage === 'employees' && <EmployeePage employees={employees} departments={departments} onRefresh={fetchData} />}
          {currentPage === 'payroll' && <PayrollPage employees={employees} />}
          {currentPage === 'reports' && <ReportsPage employees={employees} />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}
