// EmployeeDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosApi from "../../lib/axiosApi";

type VisaDoc = { type: string; url: string };

type OnboardingData = {
   firstName?: string;
   middleName?: string;
   lastName?: string;
   preferredName?: string;
   address?: {
      building?: string;
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
   };
   cellPhone?: string;
   workPhone?: string;
   car?: { make?: string; model?: string; color?: string };
   email?: string;
   ssn?: string;
   dob?: string;
   gender?: string;
   isCitizenOrPR?: string;
   citizenstatus?: string;
   hasDriverLicense?: boolean;
   driverLicenseNumber?: string;
   driverLicenseExpirationDate?: string;
   referral?: {
      firstName?: string;
      middleName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      relationship?: string;
   };
   emergencyContact?: Array<{
      firstName?: string;
      middleName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      relationship?: string;
   }>;
   visa?: { type?: string; otherVisaTitle?: string; startDate?: string; endDate?: string };
   documents?: VisaDoc[];
};

type Employee = {
   _id: string;
   userName: string;
   email: string;
   firstName?: string;
   lastName?: string;
   preferredName?: string;
   phone?: string;
   ssn?: string;
   workAuthTitle?: string;
   profilePicUrl?: string;
   visaType?: string;
   visaDocs?: VisaDoc[];
   application?: {
      data?: OnboardingData;
      documents?: VisaDoc[];
      status?: string;
      feedback?: string;
   };
};

export default function EmployeeDetailPage() {
   const { userId } = useParams<{ userId: string }>();
   const [emp, setEmp] = useState<Employee | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!userId) return;
      setLoading(true);
      axiosApi
         .get<Employee>(`/api/users/${userId}`)
         .then((res) => {
         setEmp(res.data);
         setError(null);
         })
         .catch((err) => {
         setError(err.response?.data?.message || err.message);
         })
         .finally(() => setLoading(false));
   }, [userId]);

   if (loading) return <p>Loading…</p>;
   if (error) return <div className="alert alert-danger">Error: {error}</div>;
   if (!emp) return <p>Employee not found.</p>;

   const d = emp.application?.data;

   return (
      <div className="container my-4">
         {/* Header with Avatar */}
         <div className="d-flex align-items-center mb-4">
         {emp.profilePicUrl && (
            <img
               src={emp.profilePicUrl}
               alt="Avatar"
               className="rounded-circle me-3 shadow"
               style={{ width: 80, height: 80, objectFit: "cover" }}
            />
         )}
         <h2 className="mb-0">
            {d?.firstName || emp.firstName}{" "}
            {d?.lastName || emp.lastName}{" "}
            {d?.preferredName && <small className="text-muted">({d.preferredName})</small>}
         </h2>
         </div>

         {/* Two-Column Grid */}
         <div className="row g-4">
         {/* Left column: Core Info */}
         <div className="col-md-6">
            <div className="card shadow-sm">
               <div className="card-body">
               <h5 className="card-title">Core Information</h5>
               <p><strong>Username:</strong> {emp.userName}</p>
               <p><strong>Email:</strong> {emp.email}</p>
               <p><strong>Phone:</strong> {d?.cellPhone || emp.phone || "—"}</p>
               <p><strong>SSN:</strong> {d?.ssn || emp.ssn || "—"}</p>
               <p><strong>Work Auth:</strong> {emp.workAuthTitle || d?.citizenstatus || "—"}</p>
               </div>
            </div>
         </div>

         {/* Right column: Onboarding Status */}
         <div className="col-md-6">
            <div className="card shadow-sm">
               <div className="card-body">
               <h5 className="card-title">Application Status</h5>
               <p className={`badge bg-${emp.application?.status === "Approved" ? "success"
                  : emp.application?.status === "Rejected" ? "danger"
                  : "warning"} fs-6`}>
                  {emp.application?.status || "—"}
               </p>
               {emp.application?.status === "Rejected" && (
                  <>
                     <h6 className="mt-3">Feedback</h6>
                     <p className="text-muted">{emp.application.feedback}</p>
                  </>
               )}
               </div>
            </div>
         </div>

         {/* Full-width sections */}
         <div className="col-12">
            {/* Address & Car */}
            <div className="row g-4">
               <div className="col-md-6">
               <div className="card shadow-sm">
                  <div className="card-body">
                     <h5 className="card-title">Address</h5>
                     {d?.address ? (
                     <>
                        <p>{d.address.building}, {d.address.street}</p>
                        <p>{d.address.city}, {d.address.state} {d.address.zip}</p>
                     </>
                     ) : <p className="text-muted">No address on file.</p>}
                  </div>
               </div>
               </div>
               <div className="col-md-6">
               <div className="card shadow-sm">
                  <div className="card-body">
                     <h5 className="card-title">Car Information</h5>
                     <p>
                     {d?.car?.make || "—"} {d?.car?.model || ""}{" "}
                     <span className="text-muted">({d?.car?.color || "—"})</span>
                     </p>
                  </div>
               </div>
               </div>
            </div>
         </div>

         {/* Referral & Emergency Contacts */}
         <div className="col-md-6">
            <div className="card shadow-sm">
               <div className="card-body">
               <h5 className="card-title">Referral</h5>
               {d?.referral?.firstName ? (
                  <p>
                     {d.referral.firstName} {d.referral.lastName}<br/>
                     <small className="text-muted">{d.referral.relationship}</small><br/>
                     {d.referral.phone}<br/>
                     {d.referral.email}
                  </p>
               ) : <p className="text-muted">No referral provided.</p>}
               </div>
            </div>
         </div>
         <div className="col-md-6">
            <div className="card shadow-sm">
               <div className="card-body">
               <h5 className="card-title">Emergency Contacts</h5>
               {d?.emergencyContact?.length ? (
                  d.emergencyContact.map((c, i) => (
                     <div key={i} className="mb-3">
                     <strong>{c.firstName} {c.lastName}</strong><br/>
                     <small className="text-muted">{c.relationship}</small><br/>
                     {c.phone} / {c.email}
                     </div>
                  ))
               ) : <p className="text-muted">None on file.</p>}
               </div>
            </div>
         </div>
         </div>
      </div>
   );
}