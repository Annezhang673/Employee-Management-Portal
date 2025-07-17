import House from "../models/house.js";
import User from "../models/user_model.js";

// Employee: View all available houses
export const getAvailableHouses = async (req, res) => {
  try {
    const houses = await House.find({ available: true });
    res.status(200).json(houses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Employee: View their assigned house
export const getMyHousing = async (req, res) => {
  try {
    const house = await House.findOne({ residents: req.user._id });
    res.status(200).json(house);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving housing info' });
  }
};

// HR: Create a new house
export const createHouse = async (req, res) => {
  try {
    const { address, landlord, facilities } = req.body;
    const newHouse = await House.create({
      address,
      landlord,
      facilities,
    });
    res.status(201).json(newHouse);
  } catch (err) {
    res.status(400).json({ message: 'Invalid house data' });
  }
};

// HR: Delete a house
export const deleteHouse = async (req, res) => {
  try {
    await House.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// HR: Assign a user to a house
export const assignUserToHouse = async (req, res) => {
  const { houseId, userId } = req.params;
  try {
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: 'House not found' });

    if (house.residents.includes(userId)) {
      return res.status(400).json({ message: 'User already assigned' });
    }

    // Check bed availability
    if (!house.facilities || house.facilities.beds <= 0) {
      return res.status(400).json({ message: 'No available beds in this house' });
    }

    house.residents.push(userId);
    house.facilities.Beds -= 1;
    house.facilities.Mattresses -= 1;
    if (house.facilities.Beds <= 0) {
      house.available = false;
    }
    await house.save();

    res.status(200).json({ message: 'User assigned successfully', house });
  } catch (err) {
    res.status(500).json({ message: 'Assignment failed' });
  }
};

// HR: Unassign a user from a house
export const unassignUserFromHouse = async (req, res) => {
  const { houseId, userId } = req.params;
  try {
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: 'House not found' });

    house.residents = house.residents.filter(id => id.toString() !== userId);
    house.facilities.Beds += 1;
    house.facilities.Mattresses += 1;
    house.available = true;
    await house.save();

    res.status(200).json({ message: 'User unassigned', house });
  } catch (err) {
    res.status(500).json({ message: 'Unassignment failed' });
  }
};

export const randomlyAssignUserToHouse = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingAssignment = await House.findOne({ residents: userId });
    if (existingAssignment) {
      return res.status(400).json({ message: 'User is already assigned to a house' });
    }

    const availableHouses = await House.find({
      'facilities.Beds': { $gt: 0 },
      'facilities.Mattresses': { $gt: 0 },
    });

    if (availableHouses.length === 0) {
      return res.status(400).json({ message: 'No available houses' });
    }

    const selectedHouse = availableHouses[Math.floor(Math.random() * availableHouses.length)];

    selectedHouse.residents.push(userId);
    selectedHouse.facilities.Beds -= 1;
    selectedHouse.facilities.Mattresses -= 1;
    await selectedHouse.save();

    res.status(200).json({
      message: 'User randomly assigned to a house',
      house: selectedHouse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Random assignment failed' });
  }
};
