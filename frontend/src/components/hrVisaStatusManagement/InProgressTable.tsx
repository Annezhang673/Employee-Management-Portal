import { VisaRecord } from "../../store/slices/visaSlice";
import { Button, Table, Spinner } from "react-bootstrap";

interface Props {
   data: VisaRecord[];
   loading: boolean;
   onApprove: (userId: string, type: string, dates?: { startDate: string; endDate: string }) => void;
   onReject:  (userId: string, type: string, feedback: string) => void;
   onNotify:  (userId: string) => void;
}

export default function InProgressTable({ data, loading, onApprove, onReject, onNotify }: Props) {
   if (loading) return <Spinner animation="border" />;
   if (!data.length) return <p>No in-progress records.</p>;

   return (
      <Table striped bordered hover>
         <thead>
         <tr>
            <th>Name</th>
            <th>Visa Type</th>
            <th>Start – End</th>
            <th>Days Left</th>
            <th>Next Step</th>
            <th>Action</th>
         </tr>
         </thead>
         <tbody>
         {data.map((u) => (
            <tr key={u.userId}>
               <td>{u.fullName}</td>
               <td>{u.visaType}</td>
               <td>
               {u.startDate || "--"} – {u.endDate || "--"}
               </td>
               <td>{u.daysRemaining}</td>
               <td>{u.nextStep}</td>
               <td>
               {u.pendingDoc ? (
                  <>
                     <Button
                        size="sm"
                        variant="secondary"
                        className="me-1"
                        onClick={() => {
                           console.log("Preview URL:", u.pendingDoc?.url);
                           if (u.pendingDoc?.url) {
                              window.open(u.pendingDoc.url, "_blank");
                           } else {
                              alert("No URL to preview!");
                           }
                        }}
                     >
                     Preview
                     </Button>

                     <Button
                        size="sm"
                        onClick={() => onApprove(u.userId, u.pendingDoc!.type)}
                     >
                     Approve
                     </Button>{" "}
                     <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                           onReject(u.userId, u.pendingDoc!.type, window.prompt("Feedback?") || "")
                     }
                     >
                     Reject
                     </Button>
                  </>
               ) : (
                  <Button size="sm" onClick={() => onNotify(u.userId)}>
                     Send Notification
                  </Button>
               )}
               </td>


            </tr>
         ))}
         </tbody>
      </Table>
   );
}