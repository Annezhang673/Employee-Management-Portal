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
   const [emp, setEmp]       = useState<Employee | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError]     = useState<string | null>(null);

   useEffect(() => {
      if (!userId) return;
      setLoading(true);

      axiosApi.get<Employee>(`/api/users/${userId}`)
         .then(res => {
         setEmp(res.data);
         setError(null);
         })
         .catch(err => {
         setError(err.response?.data?.error || err.message);
         })
         .finally(() => setLoading(false));
   }, [userId]);

   if (loading) return <p>Loading…</p>;
   if (error)   return <p className="text-danger">Error: {error}</p>;
   if (!emp)    return <p>Employee not found.</p>;

   const d = emp.application?.data;

   return (
      <div className="container py-4">
         {/* --- Basic Profile --- */}
         <h2 className="mb-3">
         {d?.firstName || emp.firstName || ""}{" "}
         {d?.middleName || ""}{" "}
         {d?.lastName || emp.lastName || ""}
         {d?.preferredName ? ` (${d.preferredName})` : ""}
         </h2>
         <p><strong>Username:</strong> {emp.userName}</p>
         <p><strong>Email:</strong> {emp.email}</p>
         <p><strong>Phone:</strong> {d?.cellPhone || emp.phone || "—"}</p>
         <p><strong>SSN:</strong> {d?.ssn || emp.ssn || "—"}</p>
         <p><strong>Work Auth:</strong> {emp.workAuthTitle || d?.citizenstatus || "—"}</p>

         {/* --- Address --- */}
         <div className="mb-4">
         <h5>Address</h5>
         {d?.address ? (
            <>
               <p>{d.address.building}, {d.address.street}</p>
               <p>{d.address.city}, {d.address.state} {d.address.zip}</p>
            </>
         ) : <p>—</p>}
         </div>

         {/* --- Car Info --- */}
         <div className="mb-4">
         <h5>Car Information</h5>
         <p>
            {d?.car?.make || "—"}{" "}
            {d?.car?.model || ""}  
            ({d?.car?.color || "—"})
         </p>
         </div>

         {/* --- Referral --- */}
         <div className="mb-4">
         <h5>Referral</h5>
         {d?.referral?.firstName ? (
            <p>
               {d.referral.firstName} {d.referral.middleName} {d.referral.lastName}<br/>
               {d.referral.relationship}<br/>
               {d.referral.phone}<br/>
               {d.referral.email}
            </p>
         ) : <p>—</p>}
         </div>

         {/* --- Emergency Contacts --- */}
         <div className="mb-4">
         <h5>Emergency Contacts</h5>
         {d?.emergencyContact?.length ? (
            d.emergencyContact.map((c, i) => (
               <div key={i} className="border p-2 mb-2">
               <strong>
                  {c.firstName} {c.middleName} {c.lastName}
               </strong><br/>
               {c.relationship}<br/>
               {c.phone} / {c.email}
               </div>
            ))
         ) : <p>—</p>}
         </div>

         {/* --- Application Status & Feedback --- */}
         <div className="mb-4">
         <h5>Application Status</h5>
         <p>{emp.application?.status || "—"}</p>
         {emp.application?.status === "Rejected" && (
            <>
               <h6>Feedback</h6>
               <p>{emp.application.feedback}</p>
            </>
         )}
         </div>
      </div>
   );
}
