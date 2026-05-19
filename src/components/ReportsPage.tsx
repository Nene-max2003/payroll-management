import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props { employees: any[]; }

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function ReportsPage({ employees }: Props) {
  const totalSalary = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
  const active = employees.filter(e => e.status === 'Active' || !e.status).length;
  const inactive = employees.filter(e => e.status === 'Inactive').length;
  const onLeave = employees.filter(e => e.status === 'On Leave').length;

  // Department breakdown
  const deptMap: Record<string, { count: number; salary: number }> = {};
  employees.forEach(e => {
    const dept = e.departments?.name || 'Unassigned';
    if (!deptMap[dept]) deptMap[dept] = { count: 0, salary: 0 };
    deptMap[dept].count++;
    deptMap[dept].salary += Number(e.salary) || 0;
  });
  const deptData = Object.entries(deptMap).map(([name, v]) => ({ name, employees: v.count, salary: v.salary }));

  const statusData = [
    { name: 'Active', value: active },
    { name: 'Inactive', value: inactive },
    { name: 'On Leave', value: onLeave },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
        <p className="text-sm text-gray-500">Overview of your workforce and payroll data</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', value: employees.length },
          { label: 'Active', value: active },
          { label: 'Monthly Cost', value: `$${totalSalary.toLocaleString()}` },
          { label: 'Avg Salary', value: employees.length ? `$${Math.round(totalSalary / employees.length).toLocaleString()}` : '$0' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Employees by Department</h3>
          {deptData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">No data available yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="employees" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Employee Status Distribution</h3>
          {statusData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">No data available yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-900">Department Salary Summary</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Department', 'Employees', 'Total Salary', 'Avg Salary'].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deptData.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No department data yet</td></tr>
            ) : deptData.map((dept, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-medium text-gray-900">{dept.name}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{dept.employees}</td>
                <td className="px-5 py-3 text-sm text-gray-600">${dept.salary.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm text-gray-600">${dept.employees ? Math.round(dept.salary / dept.employees).toLocaleString() : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
