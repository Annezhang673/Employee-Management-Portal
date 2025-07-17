import { useState, useEffect} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axiosApi from "../../lib/axiosApi";

export default function ApplicationDetailPage() {
   const { appId }   = useParams<{ appId: string }>();
   const navigate    = useNavigate();

   const [app, setApp] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>();

   useEffect( () => {
      if (!appId) return;

      axiosApi.get(`/api/hiring/review/${appId}`)
         .then(res => setApp(res.data))
         .catch(err => setError(err.message))
         .finally(() => setLoading(false));
   }, [appId]);

   if (loading) return <p>Loading application…</p>;
   if (error || !app) return <p className="text-danger">Error: {error||'Not found'}</p>;

   const handleApprove = async () => {
      await axiosApi.put(`/api/hiring/review/${appId}/approve`);
      alert('Approved');
      navigate(-1);
   };
   const handleReject = async () => {
      const fb = prompt('Feedback:')||'';
      if (!fb) return;
      await axiosApi.put(`/api/hiring/review/${appId}/reject`, { feedback: fb });
      alert('Rejected');
      navigate(-1);
   };

   return (
      <div className="container p-4">
         <h1>Application Review</h1>
         <p>
            <strong>Name:</strong> {app.user.userName}<br/>
            <strong>Email:</strong> {app.user.email}<br/>
            <strong>Status:</strong> {app.status}
         </p>

         {/* Feedback if Rejected */}
         {app.status === 'Rejected' && (
            <div className="alert alert-warning">
               <strong>Feedback:</strong> {app.feedback}
            </div>
         )}

         <hr/>

         {/* All form data */}
         <h3>Form Data</h3>
         {Object.entries(app.data).map(([key, val]) => (
            <p key={key}>
               <strong>{key}:</strong> {String(val)}
            </p>
         ))}

         <hr/>

         {/* Documents list */}
         <h3>Documents</h3>
         <ul>
         {app.documents.map((doc: any) => (
            <li key={doc.name}>
               <a href={doc.previewUrl} target="_blank" rel="noreferrer">
                  {doc.name}
               </a>
            </li>
         ))}
         </ul>

         {/* Actions for Pending */}
         {app.status === 'Pending' && (
            <div className="mt-4">
               <button className="btn btn-success me-2" onClick={handleApprove}>
                  Approve
               </button>

               <button className="btn btn-danger" onClick={handleReject}>
                  Reject
               </button>
            </div>
         )}

      </div>
   )
}