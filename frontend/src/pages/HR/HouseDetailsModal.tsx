import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  Divider,
  Pagination,
  ButtonGroup,
} from "@mui/material";
import axiosApi from "../../lib/axiosApi";
import toast from "react-hot-toast";

interface Landlord {
  name: string;
  contact: string;
}

interface Facilities {
  Beds: number;
  Mattresses: number;
  Tables: number;
  Chairs: number;
}

interface Resident {
  _id: string;
  lastName?: string;
  firstName?: string;
  preferredName?: string;
  phone?: string;
  email?: string;
  carInfo?: string;
}

interface House {
  _id: string;
  address: string;
  landlord: Landlord;
  facilities: Facilities;
  residents: Resident[];
}

interface HouseDetailsModalProps {
  house: House;
  onClose: () => void;
  refresh: () => Promise<void>;
}

interface Comment {
  description?: string;
  text?: string;
  createdByName?: string;
  createdAt: string;
}

interface FacilityReport {
  _id: string;
  title: string;
  description: string;
  comments: Comment[];
  createdAt: string;
  status: string;
}

const ITEMS_PER_PAGE = 5;

const HouseDetailsModal: React.FC<HouseDetailsModalProps> = ({
  house,
  onClose,
  refresh,
}) => {
  const [facilityReports, setFacilityReports] = useState<FacilityReport[]>([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [residentInfo, setResidentInfo] = useState<Resident[]>([]);
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  const fetchReports = useCallback(async () => {
    const res = await axiosApi.get(`/api/report/house/${house._id}`);

    setFacilityReports(
      res.data.sort(
        (a: FacilityReport, b: FacilityReport) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }, [house._id]);

  const fetchComments = useCallback(async (reportId: string) => {
    const res = await axiosApi.get(`/api/report/${reportId}/getComments`);
    // setComments((prev) => ({ ...prev, [reportId]: res.data }));
    setFacilityReports((prev) =>
      prev.map((report) => {
        if (report._id === reportId) {
          return {
            ...report,
            comments: res.data,
          };
        }
        return report;
      })
    );
  }, []);

  const handleAddComment = async (reportId: string) => {
    const content = newComment[reportId];
    if (!content) return;
    await axiosApi.post(`/api/report/${reportId}/addComments`, {
      description: content,
    });

    await fetchComments(reportId);

    setNewComment((prev) => ({ ...prev, [reportId]: "" }));

    toast.success("Comment added successfully");
  };

  const handleStatusChange = async (reportId: string, status: string) => {
    await axiosApi.patch(`/api/report/${reportId}/status`, { status });
    await fetchReports();
  };

  const fetchResidents = useCallback(async () => {
    try {
      const res = await axiosApi.get(`/api/housing/getResidents/${house._id}`);

      setResidentInfo(res.data.residents || []);
    } catch (error) {
      console.error("Failed to fetch residents", error);
    }
  }, [house._id]);

  useEffect(() => {
    fetchReports();
    fetchResidents();
  }, [refresh, fetchResidents, fetchReports]);

  const paginatedReports = facilityReports.slice(
    (selectedPage - 1) * ITEMS_PER_PAGE,
    selectedPage * ITEMS_PER_PAGE
  );  

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>House Details - {house.address}</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Landlord Info</Typography>
        <Typography>Name: {house.landlord?.name}</Typography>
        <Typography>Contact: {house.landlord?.contact}</Typography>

        <Typography variant="h6" mt={2}>
          Facility Info
        </Typography>
        <Typography>Beds: {house.facilities?.Beds}</Typography>
        <Typography>Mattresses: {house.facilities?.Mattresses}</Typography>
        <Typography>Tables: {house.facilities?.Tables}</Typography>
        <Typography>Chairs: {house.facilities?.Chairs}</Typography>

        <Typography variant="h6" mt={2}>
          Residents
        </Typography>
        <List>
          {residentInfo.map((user) => (
            <ListItem key={user._id}>
              <a
                href={`/profile/${user._id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.preferredName ||
                  user.firstName ||
                  user.lastName ||
                  "Unnamed"}
              </a>
              <Typography ml={2}>
                Phone: {user.phone || "N/A"} | Email: {user.email}
              </Typography>
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" mt={2}>
          Facility Reports
        </Typography>
        {paginatedReports.map((report) => (
          <div key={report._id} style={{ marginBottom: "1rem" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {report.title}
            </Typography>
            <Typography>{report.description}</Typography>
            <Typography variant="body2" color="textSecondary">
              Created: {new Date(report.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Status: {report.status}
            </Typography>
            <ButtonGroup
              variant="outlined"
              color="primary"
              size="small"
              sx={{ mt: 1 }}
            >
              <Button onClick={() => handleStatusChange(report._id, "Open")}>
                Open
              </Button>
              <Button
                onClick={() => handleStatusChange(report._id, "In Progress")}
              >
                In Progress
              </Button>
              <Button onClick={() => handleStatusChange(report._id, "Closed")}>
                Closed
              </Button>
            </ButtonGroup>

            {/* Comment Section */}
            <Typography variant="h6" mt={2}>
              Comments
            </Typography>

            {report.comments?.map((c, idx) => (
              <Typography key={idx} variant="body2" ml={2}>
                {idx + 1}. {c.text || c.description} by{" "}
                {c.createdByName || "User"} (
                {new Date(c.createdAt).toLocaleString()})
              </Typography>
            ))}

            <TextField
              label="Add comment"
              fullWidth
              margin="dense"
              value={newComment[report._id] || ""}
              onChange={(e) =>
                setNewComment((prev) => ({
                  ...prev,
                  [report._id]: e.target.value,
                }))
              }
              disabled={report.status === "Closed"}
            />
            <Button
              onClick={() => handleAddComment(report._id)}
              variant="outlined"
              disabled={report.status === "Closed"}
            >
              Submit Comment
            </Button>

            <Divider sx={{ mt: 2 }} />
          </div>
        ))}

        <Pagination
          count={Math.ceil(facilityReports.length / ITEMS_PER_PAGE)}
          page={selectedPage}
          onChange={(e, value) => setSelectedPage(value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HouseDetailsModal;
