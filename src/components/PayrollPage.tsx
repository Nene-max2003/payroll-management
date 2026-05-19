import { useState } from 'react';
import { DollarSign, Play, CheckCircle } from 'lucide-react';

interface Props { employees: any[]; }

export function PayrollPage({ employees }: Props) {
  const [processed, setProcessed] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const totalPayroll = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
  const activeEmployees = employees.filter(e => e.status === 'Active' || !e.status);

  const runPayroll = async () => {
    setRunning(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessed(activeEmployees.map(e => e.id));
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payroll Processing</h2>
          <p className="text-sm text-gray-500">Process monthly salaries for all active employees</p>
        </div>
        <button onClick={runPayroll} disabled={running || employees.length === 0}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
          {running ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
          ) : (
            <><Play className="w-4 h-4" />Run Payroll</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Payroll', value: `$${totalPayroll.toLocaleString()}`, sub: 'This month', color: 'green' },
          { label: 'Employees to Pay', value: activeEmployees.length, sub: 'Active employees', color: 'blue' },
          { label: 'Processed', value: processed.length, sub: 'Completed payments', color: 'purple' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                <DollarSign className={`w-4 h-4 text-${stat.color}-600`} />
              </div>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Payroll Register</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Employee', 'Department', 'Basic Salary', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400">No employees to process. Add employees first!</td></tr>
            ) : employees.map((emp, i) => (
              <tr key={i} className="hover:bg-gray-50">
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
                <td className="px-5 py-3 text-sm font-medium text-gray-900">${Number(emp.salary || 0).toLocaleString()}</td>
                <td className="px-5 py-3">
                  {processed.includes(emp.id) ? (
                    <span className="flex items-center gap-1 text-xs text-green-700 font-medium bg-green-100 px-2 py-1 rounded-full w-fit">
                      <CheckCircle className="w-3 h-3" />Paid
                    </span>
                  ) : (
                    <span className="text-xs text-yellow-700 font-medium bg-yellow-100 px-2 py-1 rounded-full">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
