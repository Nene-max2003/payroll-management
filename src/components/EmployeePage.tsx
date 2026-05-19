import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Search, X, Trash2, Edit2 } from 'lucide-react';

interface Props {
  employees: any[];
  departments: any[];
  onRefresh: () => void;
}

export function EmployeePage({ employees, departments, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    department_id: '', designation: '', joining_date: '',
    salary: '', status: 'Active',
  });

  const filtered = employees.filter(e =>
    `${e.first_name} ${e.last_name} ${e.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ first_name: '', last_name: '', email: '', phone: '', department_id: '', designation: '', joining_date: '', salary: '', status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (emp: any) => {
    setEditing(emp);
    setForm({
      first_name: emp.first_name || '',
      last_name: emp.last_name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      department_id: emp.department_id || '',
      designation: emp.designation || '',
      joining_date: emp.joining_date || '',
      salary: emp.salary || '',
      status: emp.status || 'Active',
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editing) {
        await supabase.from('employees').update(form).eq('id', editing.id);
      } else {
        await supabase.from('employees').insert([form]);
      }
      onRefresh();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this employee?')) return;
    await supabase.from('employees').delete().eq('id', id);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Employee Directory</h2>
          <p className="text-sm text-gray-500">{employees.length} total employees</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search employees..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Employee', 'Department', 'Position', 'Salary', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No employees found. Add your first employee!</td></tr>
            ) : filtered.map((emp, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      {emp.first_name?.[0]}{emp.last_name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{emp.first_name} {emp.last_name}</p>
                      <p className="text-xs text-gray-400">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-600">{emp.departments?.name || 'Unassigned'}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{emp.designation || '—'}</td>
                <td className="px-5 py-3 text-sm text-gray-600">${Number(emp.salary || 0).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {emp.status || 'Active'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(emp)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(emp.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{editing ? 'Edit Employee' : 'Add New Employee'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {[
                { label: 'First Name', key: 'first_name' },
                { label: 'Last Name', key: 'last_name' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' },
                { label: 'Designation', key: 'designation' },
                { label: 'Joining Date', key: 'joining_date', type: 'date' },
                { label: 'Salary', key: 'salary', type: 'number' },
              ].map(field => (
                <div key={field.key} className={field.key === 'email' ? 'col-span-2' : ''}>
                  <label className="text-xs font-semibold text-gray-500 uppercase">{field.label}</label>
                  <input type={field.type || 'text'}
                    value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Department</label>
                <select value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select...</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>On Leave</option>
                </select>
              </div>
            </div>
            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSubmit} disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : (editing ? 'Save Changes' : 'Add Employee')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
