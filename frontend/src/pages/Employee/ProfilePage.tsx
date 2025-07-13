import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setUserInfo } from "../../store/slices/userInfoSlice";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const mockId = "68730bb6ffbffeea6daaf227";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          params: { userId: mockId },
        });

        if (response.data?.application) {
          dispatch(setUserInfo(response.data.application[0]));
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    if (userInfo === null) {
      fetchUserInfo();
    }
  }, [userInfo, dispatch]);

  console.log(userInfo);
  


  return <div className="container">

  
  </div>;
}
