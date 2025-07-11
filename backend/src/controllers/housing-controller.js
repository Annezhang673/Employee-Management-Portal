import User from "../models/user_model.js";
import House from "../models/house.js";

// Employee views assigned house and roommates
export const viewMyHousing = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const house = await House.findById(user.house);

    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    res.status(200).json({ house });
  } catch (error) {
    console.log("Housing not found", error);
    res.status(500).json({ error: "Housing not found", error });
  }
};

// HR views all houses
export const viewAllHousing = async (req, res) => {
  try {
    const houses = await House.find({});

    res.status(200).json({ houses });
  } catch (error) {
    console.log("Houses not found", error);
    res.status(500).json({ error: "Houses not found", error });
  }
};

// HR creates new house
export const createNewHousing = (req, res) => {
  try {
    const newHouse = new House(req.body);
    newHouse.save();
    res.status(201).json({ message: "House created successfully" });
  } catch (error) {
    console.log("House not created", error);
    res.status(500).json({ error: "House not created", error });
  }
};

// HR deletes house
export const deleteHousing = (req, res) => {
  try {
    const houseId = req.params.houseId;
    House.findByIdAndDelete(houseId);
    res.status(200).json({ message: "House deleted successfully" });
  } catch (error) {
    console.log("House not deleted", error);
    res.status(500).json({ error: "House not deleted", error });
  }
};
