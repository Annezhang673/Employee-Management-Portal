import {useState, useEffect, FormEvent} from 'react';
import { fetchTokens, generateToken } from '../../store/slices/tokenSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function RegistrationTokenTab() {
   const dispatch = useAppDispatch();
   const { history, loading, error } = useAppSelector(
      state => state.tokens
   );
   const [email, setEmail] = useState('');

   useEffect(() => {
      dispatch(fetchTokens());
   }, [dispatch]);

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      dispatch(generateToken(email));
      setEmail('');
   };

   return (
      <div>
         <h2>Generate Registration Token</h2>
         {error && <div className="alert alert-danger">{error}</div>}

         <form onSubmit={handleSubmit} className="mb-4">
            <div className="input-group">
               <input
                  type="email"
                  className="form-control"
                  placeholder="Employee email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
               />
               <button className="btn btn-primary" disabled={loading}>
                  {loading ? '…' : 'Generate'}
               </button>
            </div>
         </form>

         <h3>History</h3>
         {loading && <p>Loading…</p>}
         {!loading && history.length === 0 && <p>No tokens yet.</p>}
         {!loading && history.length > 0 && (
         <table className="table">
            <thead>
               <tr>
                  <th>Email</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th>Created At</th>
               </tr>
            </thead>

            <tbody>
               {history.map( t => (
                  <tr key={t.link}>
                     <td>{t.email}</td>

                     <td>
                        <a href={t.link} target="_blank" rel="noreferrer">
                           {t.link}
                        </a>
                     </td>

                     <td>{t.status}</td>
                     <td>{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
               ))}
            </tbody>
         </table>
         )}
      </div>
   );
}