import { useEffect } from 'react';
import { fetchBucket, approveApp, rejectApp } from '../../store/slices/reviewSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { stat } from 'fs';


/*
OnboardingReviewTab purpose:

1. Fetches all applications in 3 states
2. Display all applications
3. Allow HR to approve or reject pending applications

workflow:
1. intialize 3 arrays with different status
2. On mount, do this --> GET /api/hiring/review?status=… and populates state.
3. "Approve button", call the approve endpoint, remove it from pending, re-fetch approved
4. "Reject button", prompts for feedback, call the reject endpoint, remove it from pending, re-fetch rejected
*/

// interface AppRow {
//    appId:      string;
//    userName:   string;
//    email:      string;
//    submitted:  string;
// }

// export default function OnboardingReviewTab() {
//    const [pending, setPending] = useState<AppRow[]>([]);
//    const [rejected, setRejected] = useState<AppRow[]>([]);
//    const [approved, setApproved] = useState<AppRow[]>([]);

//    useEffect( () => {
//       fetchBucket('Pending', setPending);
//       fetchBucket('Rejected', setRejected);
//       fetchBucket('Approved', setApproved);
//    }, []);

//    async function fetchBucket(status: string, setter: (data: AppRow[]) => void) {
//       const res = await axios.get<AppRow[]>('/api/hiring/review', { params: { status } });
//       setter(res.data);
//    }

//    async function handleApprove(appId: string) {
//       await axios.put(`api/hiring/review/${appId}/approve`);
//       setPending(p => p.filter(a => a.appId !== appId));
//       fetchBucket('Approved', setApproved);
//    }

//    async function handleReject(appId: string) {
//       const feedback = prompt('Rejection feedback:') || '';
//       await axios.put(`api/hiring/review/${appId}/reject`, { feedback });
//       setPending(p => p.filter(a => a.appId !== appId));
//       fetchBucket('Rejected', setRejected);
//    }

//    return (
//       <div className='row'>
//          {['Pending', 'Rejected', 'Approved'].map(status => (
//             <div key={status} className='col-md-4'>
//                <h3>{status}</h3>
//                <ul className='list-group'>
//                   {(status==='Pending' ? pending : status==='Rejected' ? rejected : approved).map(a => (
//                      <li key={a.appId} className='list-group-item d-flex justify-content-between align-items-center'>
//                         <span> {a.userName} ({new Date(a.submitted).toLocaleDateString()}) </span>
//                         {status==='Pending' && (
//                            <div>
//                               <button className="btn btn-success btn-sm me-1" onClick={() => handleApprove(a.appId)}>
//                                  Approve
//                               </button>

//                               <button className="btn btn-danger btn-sm" onClick={() => handleReject(a.appId)}>
//                                  Reject
//                               </button>
//                            </div>
//                         )}
//                      </li>
//                   ))}
//                </ul>
//             </div>
//          ))}
//       </div>
//    );

// }

/*
work flow:
1. useEffect --> dispatches fetchBucket('Pending'), fetchBucket('Rejected'), fetchBucket('Approved')
2. Each thunk issues HTTP GET --> it updates the Redux store once success
3. Component re-renders whenever 'loading' or any bucket array changes
*/

export default function OnboardingReviewTab() {
   const dispatch = useAppDispatch();
   const { pending, rejected, approved, loading, error } = useAppSelector(
      state => state.review
   );

   useEffect(() => {
      dispatch(fetchBucket('Pending'));
      dispatch(fetchBucket('Rejected'));
      dispatch(fetchBucket('Approved'));
   }, [dispatch]);

   if (error) return <div className="alert alert-danger">{error}</div>;

   return (
      <div className='row'>
         { (['Pending', 'Rejected', 'Approved'] as const).map(status => {
            const apps = status ==='Pending' ? pending : status === 'Rejected'
               ? rejected : approved;

            return (
               <div key={status} className='col-md-4'>
                  <h3>{status}</h3>
                  {loading && <p>Loading ...</p>}

                  <ul className='list-group'>
                     {apps.map( a => (
                        <li 
                           key={a.appId}
                           className="list-group-item d-flex justify-content-between align-items-center"
                        >
                           {/* Name & Email */}
                           <div>
                              <strong>{a.userName}</strong><br/>
                              <small>{a.email}</small>
                           </div>

                           {/* View Application */}
                           <button
                              className='btn btn-link'
                              onClick={ () => window.open(`/app/hiring/review/${a.appId}`, '_blank')}
                           >
                              View Application
                           </button>

                           {/* Only For Pending */}
                           {status === 'Pending' &&  (
                              <div>
                                 <button
                                    className="btn btn-success btn-sm me-1"
                                    onClick={() => dispatch(approveApp(a.appId))}
                                 >
                                    Approve
                                 </button>

                                 <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {
                                       const fb = prompt('Rejection feedback:') || '';
                                       dispatch(rejectApp({ appId: a.appId, feedback: fb }));
                                    }}
                                 >
                                    Reject
                                 </button>
                              </div>
                           )}
                        </li>
                     ))}
                  </ul>
               </div>
            )
         })}
      </div>
   );
}