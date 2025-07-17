import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField,
  List, ListItem, Divider, Pagination
} from '@mui/material';

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
  description: string;
  createdByName?: string;
  createdAt: string;
}

interface FacilityReport {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  status: string;
}

const ITEMS_PER_PAGE = 5;

const HouseDetailsModal: React.FC<HouseDetailsModalProps> = ({ house, onClose, refresh }) => {
  const [facilityReports, setFacilityReports] = useState<FacilityReport[]>([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [residentInfo, setResidentInfo] = useState<Resident[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const token = localStorage.getItem('token');

  const fetchReports = async () => {
    const res = await axios.get(`/api/report/house/${house._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFacilityReports(res.data.sort((a: FacilityReport, b: FacilityReport) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const fetchComments = async (reportId: string) => {
    const res = await axios.get(`/api/report/${reportId}/getComments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments(prev => ({ ...prev, [reportId]: res.data }));
  };

  const handleAddComment = async (reportId: string) => {
    const content = newComment[reportId];
    if (!content) return;
    await axios.post(`/api/report/${reportId}/addComments`, { description: content }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNewComment(prev => ({ ...prev, [reportId]: '' }));
    await fetchComments(reportId);
  };

  const handleStatusChange = async (reportId: string, status: string) => {
    await axios.patch(`/api/report/${reportId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchReports();
  };

  const fetchResidents = async () => {
  try {
    const res = await axios.get(`/api/housing/getResidents/${house._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setResidentInfo(res.data.residents || []);
  } catch (error) {
    console.error('Failed to fetch residents', error);
  }
};

  useEffect(() => {
    fetchReports();
    fetchResidents();
  }, [house]);

  const paginatedReports = facilityReports.slice((selectedPage - 1) * ITEMS_PER_PAGE, selectedPage * ITEMS_PER_PAGE);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>House Details - {house.address}</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Landlord Info</Typography>
        <Typography>Name: {house.landlord?.name}</Typography>
        <Typography>Contact: {house.landlord?.contact}</Typography>

        <Typography variant="h6" mt={2}>Facility Info</Typography>
        <Typography>Beds: {house.facilities?.Beds}</Typography>
        <Typography>Mattresses: {house.facilities?.Mattresses}</Typography>
        <Typography>Tables: {house.facilities?.Tables}</Typography>
        <Typography>Chairs: {house.facilities?.Chairs}</Typography>

        <Typography variant="h6" mt={2}>Residents</Typography>
        <List>
          {residentInfo.map(user => (
            <ListItem key={user._id}>
              <a href={`/profile/${user._id}`} target="_blank" rel="noopener noreferrer">
                {user.preferredName || user.firstName || user.lastName || 'Unnamed'}
              </a>
              <Typography ml={2}>
                Phone: {user.phone || 'N/A'} | Email: {user.email}
              </Typography>
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" mt={2}>Facility Reports</Typography>
        {paginatedReports.map(report => (
          <div key={report._id} style={{ marginBottom: '1rem' }}>
            <Typography variant="subtitle1">{report.title}</Typography>
            <Typography>{report.description}</Typography>
            <Typography variant="body2">Created: {new Date(report.createdAt).toLocaleString()}</Typography>
            <Typography>Status: {report.status}</Typography>
            <Button onClick={() => handleStatusChange(report._id, 'Open')}>Open</Button>
            <Button onClick={() => handleStatusChange(report._id, 'In Progress')}>In Progress</Button>
            <Button onClick={() => handleStatusChange(report._id, 'Closed')}>Closed</Button>
            <Button onClick={() => fetchComments(report._id)}>View Comments</Button>

            {comments[report._id]?.map((c, idx) => (
              <Typography key={idx} variant="body2" ml={2}>- {c.description} by {c.createdByName || 'User'} ({new Date(c.createdAt).toLocaleString()})</Typography>
            ))}

            <TextField
              label="Add comment"
              fullWidth
              margin="dense"
              value={newComment[report._id] || ''}
              onChange={e => setNewComment(prev => ({ ...prev, [report._id]: e.target.value }))}
            />
            <Button onClick={() => handleAddComment(report._id)} variant="outlined">Submit Comment</Button>
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
