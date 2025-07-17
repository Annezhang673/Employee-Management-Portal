// src/pages/HR/HousingManagementPage.tsx
import React, { useCallback, useEffect, useState } from "react";
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
  Container,
  ButtonGroup,
} from "@mui/material";
import HouseDetailsModal from "./HouseDetailsModal";
import axiosApi from "../../lib/axiosApi";
import { CardImg } from "react-bootstrap";
import demoHouseImg from "../../assets/images/demohouse.jpg";

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

  //   const token = localStorage.getItem("token");

  const fetchHouses = useCallback(async () => {
    try {
      const res = await axiosApi.get("/api/housing/all");
      setHouses(res.data);
    } catch (error) {
      console.error("Failed to fetch houses:", error);
    }
  }, []);

  const handleCreateHouse = async () => {
    await axiosApi.post("/api/housing/createHouse", formData);
    setOpenForm(false);
    await fetchHouses();
  };

  const handleDeleteHouse = async (id: string) => {
    await axiosApi.delete(`/api/housing/${id}`);
    await fetchHouses();
  };

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);
  

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Housing Management
      </Typography>
      <Button variant="contained" onClick={() => setOpenForm(true)}>
        Add New House
      </Button>
      <Grid container spacing={1} mt={2}>
        {houses.map((house) => (
          <Grid key={house._id as string} size={{ xs: 12, md: 6 }}>
            <Card sx={{ maxWidth: 345, textAlign: "center" }}>
              <CardImg
                src={demoHouseImg}
                alt="House"
                style={{ width: "100%" }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <strong>{house.address}</strong>
                </Typography>
                <Typography>
                  <strong>Landlord:</strong> {house.landlord?.name}
                </Typography>
                <Typography>
                  <strong>Contact:</strong> {house.landlord?.contact}
                </Typography>
                <Typography>
                  <strong>Current Residents:</strong>{" "}
                  {house.residents?.length || 0}
                </Typography>
                <ButtonGroup size="small" sx={{ mt: 2 }}>
                  <Button onClick={() => setSelectedHouse(house)}>
                    Details
                  </Button>
                  <Button
                    onClick={() => handleDeleteHouse(house._id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </ButtonGroup>
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
    </Container>
  );
};

export default HousingManagementPage;
