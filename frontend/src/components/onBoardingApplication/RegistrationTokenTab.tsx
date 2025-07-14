import {useState, useEffect, FormEvent} from 'react';
import { fetchTokens, generateToken } from '../../store/slices/tokenSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import toast from 'react-hot-toast';

/*
RegistrationTokenTab purpose:

1. Lets HR enter an email to generate a registration token
2. Display all tokens with email, timestamp, and link
*/

// interface Token {
//    email: string;
//    createdAt: string;
//    status: 'Used' | 'Expired' | 'Unused';
//    link: string;
// }

// export default function RegistrationTokenTab() {
//    const [email, setEmail] = useState('');
//    const [history, setHistory] = useState<Token[]>([]);
//    const [loading, setLoading] = useState(false);

//    // load history on mount
//    useEffect( () => {
//       fetchHistory();
//    }, []);

//    async function fetchHistory() {
//       setLoading(true);
//       try{
//          const res = await axios.get<Token[]>('http://localhost:3000/api/tokens/status');
//          setHistory(res.data);
//       } finally {
//          setLoading(false);
//       }
//    }

//    async function handleSubmit(e: FormEvent) {
//       e.preventDefault();
//       setLoading(true);

//       try {
//          await axios.post('http://localhost:3000/api/tokens/generate', { email });

//          toast.success("Token generated successfully!");
//          setEmail('')   // clear input
//          await fetchHistory();   // refresh table
//       } catch (err) {
//          console.error(err);
//          toast.error("Failed to generate token");
//       } finally {
//          setLoading(false);
//       }
//    }

//    return (
//       <div>
//          <h2>Generate Registration Token</h2>
//          <form className='mb-4' onSubmit={e => e.preventDefault()}>
//             <div className="input-group">
//                <input 
//                   type='email' 
//                   className='form-control' 
//                   placeholder='Employee Email' 
//                   value={email}
//                   onChange={e => setEmail(e.target.value)}
//                   required
//                />

//                <button type='button' className='btn btn-primary' disabled={loading} onClick={handleSubmit}>
//                   {loading ? 'Sending' : 'Generate'}
//                </button>
//             </div>
//          </form>

//          <h3>History</h3>
//          {loading && <p>loading...</p>}
//          {!loading && history.length === 0 && <p>No tokens yet</p>}
//          {!loading && history.length > 0 && (
//             <table className='table'>
//                <thead>
//                   <tr>
//                      <th>Email</th>
//                      <th>Status</th>
//                      <th>Created At</th>
//                      <th>Link</th>
//                   </tr>
//                </thead>

//                <tbody>
//                   {history.map( t => (
//                      <tr key={t.link}>
//                         <td>{t.email}</td>
//                         <td>{t.status}</td>
//                         <td>{new Date(t.createdAt).toLocaleString()}</td>
//                         <td>
//                            <a href={t.link} target="_blank" rel="noreferrer">
//                            Open
//                            </a>
//                         </td>
//                      </tr>
//                   ))}
//                </tbody>
//             </table>
//          )}
//       </div>
//    )

// }

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
            {/* … render history rows … */}
         </table>
         )}
      </div>
   );
}