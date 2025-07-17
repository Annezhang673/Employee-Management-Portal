// src/pages/HR/HousingManagementPage.tsx
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import HouseDetailsModal from "./HouseDetailsModal";

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

const HousingManagementPage: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    landlord: { name: "", contact: "" },
    facilities: { Beds: 0, Mattresses: 0, Tables: 0, Chairs: 0 },
  });

  const token = localStorage.getItem("token");

  const fetchHouses = useCallback(async () => {
    try {
      const res = await axios.get("/api/housing/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHouses(res.data);
    } catch (error) {
      console.error("Failed to fetch houses:", error);
    }
  }, [token]);

  const handleCreateHouse = async () => {
    await axios.post("/api/housing/createHouse", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOpenForm(false);
    await fetchHouses();
  };

  const handleDeleteHouse = async (id: string) => {
    await axios.delete(`/api/housing/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchHouses();
  };

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  console.log("houses", houses);

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Housing Management
      </Typography>
      <Button variant="contained" onClick={() => setOpenForm(true)}>
        Add New House
      </Button>
      <Grid container spacing={2} mt={2}>
        {houses.map((house) => (
          <Grid key={house._id as string} size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{house.address}</Typography>
                <Typography>Landlord: {house.landlord?.name}</Typography>
                <Typography>Contact: {house.landlord?.contact}</Typography>
                <Typography>
                  # of Residents: {house.residents?.length || 0}
                </Typography>
                <Button onClick={() => setSelectedHouse(house)}>Details</Button>
                <Button
                  onClick={() => handleDeleteHouse(house._id)}
                  color="error"
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Add House</DialogTitle>
        <DialogContent>
          <TextField
            label="Address"
            fullWidth
            margin="dense"
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <TextField
            label="Landlord Name"
            fullWidth
            margin="dense"
            onChange={(e) =>
              setFormData({
                ...formData,
                landlord: { ...formData.landlord, name: e.target.value },
              })
            }
          />
          <TextField
            label="Landlord Contact"
            fullWidth
            margin="dense"
            onChange={(e) =>
              setFormData({
                ...formData,
                landlord: { ...formData.landlord, contact: e.target.value },
              })
            }
          />
          <TextField
            label="Beds"
            type="number"
            fullWidth
            margin="dense"
            onChange={(e) =>
              setFormData({
                ...formData,
                facilities: {
                  ...formData.facilities,
                  Beds: parseInt(e.target.value),
                },
              })
            }
          />
          <TextField
            label="Mattresses"
            type="number"
            fullWidth
            margin="dense"
            onChange={(e) =>
              setFormData({
                ...formData,
                facilities: {
                  ...formData.facilities,
                  Mattresses: parseInt(e.target.value),
                },
              })
            }
          />
          <TextField
            label="Tables"
            type="number"
            fullWidth
            margin="dense"
            onChange={(e) =>
              setFormData({
                ...formData,
                facilities: {
                  ...formData.facilities,
                  Tables: parseInt(e.target.value),
                },
              })
            }
          />
          <TextField
            label="Chairs"
            type="number"
            fullWidth
            margin="dense"
            onChange={(e) =>
              setFormData({
                ...formData,
                facilities: {
                  ...formData.facilities,
                  Chairs: parseInt(e.target.value),
                },
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button onClick={handleCreateHouse} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {selectedHouse && (
        <HouseDetailsModal
          house={selectedHouse}
          onClose={() => setSelectedHouse(null)}
          refresh={fetchHouses}
        />
      )}
    </div>
  );
};

export default HousingManagementPage;
