import { VisaRecord } from "../../store/slices/visaSlice";
import { Form, Table, Spinner } from "react-bootstrap";

interface Props {
   data: VisaRecord[];
   loading: boolean;
   searchTerm: string;
   onSearch: (term: string) => void;
}

export default function AllRecordsTable({ data, loading, searchTerm, onSearch }: Props) {
   if (loading) return <Spinner animation="border" />;

   return (
      <>
         <Form.Control
         type="text"
         placeholder="Search by name…"
         value={searchTerm}
         onChange={(e) => onSearch(e.target.value)}
         className="mb-3"
         />
         <Table striped bordered hover>
         <thead>
            <tr>
               <th>Name</th>
               <th>Visa Type</th>
               <th>Start – End</th>
               <th>Days Left</th>
               <th>Approved Documents</th>
            </tr>
         </thead>
         <tbody>
            {data.length === 0 && (
               <tr>
               <td colSpan={5}>No matching records.</td>
               </tr>
            )}
            {data.map((u) => (
               <tr key={u.userId}>
               <td>{u.fullName}</td>
               <td>{u.visaType}</td>
               <td>
                  {u.startDate || "--"} – {u.endDate || "--"}
               </td>
               <td>{u.daysRemaining}</td>
               <td>
                  {u.approvedDocs && u.approvedDocs.length > 0 ? (
                     u.approvedDocs.map((doc) => (
                     <div key={doc.type}>
                        <a href={doc.url} target="_blank" rel="noreferrer">
                           {doc.type}
                        </a>
                     </div>
                     ))
                  ) : (
                     <span>—</span>
                  )}
               </td>
               </tr>
            ))}
         </tbody>
         </Table>
      </>
   );
}