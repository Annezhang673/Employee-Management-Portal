import { useEffect } from 'react';
import { fetchBucket, approveApp, rejectApp } from '../../store/slices/reviewSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
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