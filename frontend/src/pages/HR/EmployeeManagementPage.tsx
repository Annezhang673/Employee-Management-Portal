import { useState, useEffect } from "react";
import axiosApi from "../../lib/axiosApi";
import { useNavigate } from 'react-router-dom';

interface EmployeeSummary {
  _id: string;
  firstName: string | null;
  lastName:  string | null;
  preferredName?: string | null;
  ssn?: string | null;
  workAuthTitle?: string | null;
  phone?: string | null;
  email: string;
}


export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect( ()=> {
    axiosApi.get<EmployeeSummary[]>('/api/users')
      .then(res => setEmployees(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  });

  const filtered = employees.filter( emp => {
    const term = searchTerm.toLowerCase();

    return (
      (emp.firstName || "").toLowerCase().includes(term) ||
      (emp.lastName || "").toLowerCase().includes(term) ||
      (emp.preferredName || '').toLowerCase().includes(term)
    );
  });

  if (loading) {
    return <p>Loading Employess</p>
  }

  return (
    <div className="container py-4">
      <h2>Employee Profiles</h2>

      <div className="mb-3">
        <input 
          type="text"
          className="form-control"
          placeholder="Search by name or preferred name.."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <p>Total employees: {employees.length}</p>

      <table  className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>SSN</th>
            <th>Work Auth</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(emp => (
            <tr key={emp._id}>
              <td>
                <button
                  className="btn btn-link p-0"
                  onClick={() =>
                    window.open(`/app/employees/${emp._id}`, '_blank')
                  }
                >
                  {emp.firstName} {emp.lastName}
                  {emp.preferredName ? ` (${emp.preferredName})` : ''}
                </button>
              </td>
              <td>{emp.ssn || '—'}</td>
              <td>{emp.workAuthTitle || '—'}</td>
              <td>{emp.phone || '—'}</td>
              <td>{emp.email}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">
                No matching employees.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
