import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Chats = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const getFile = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.blob();
      return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
    } catch (error) {
      console.error("Error fetching user photo:", error);
      return null;
    }
  };

  useEffect(() => {
    const setupChatEngine = async () => {
      if (!user) {
        navigate("/");
        return;
      }

      try {
        await axios.get("https://api.chatengine.io/users/me", {
          headers: {
            "project-id": "e4391406-3e36-445c-831f-58907a0770c2",
            "user-name": user.email,
            "user-secret": user.uid,
          },
        });
        setLoading(false);
      } catch (error) {
        const formData = new FormData();
        formData.append("email", user.email);
        formData.append("username", user.displayName || user.email);
        formData.append("secret", user.uid);

        const avatar = await getFile(user.photoURL);
        if (avatar) {
          formData.append("avatar", avatar, avatar.name);

          try {
            await axios.post("https://api.chatengine.io/users/", formData, {
              headers: {
                "Private-key": "06b48f8c-b5b6-4373-a884-72892392060c",
              },
            });
            setLoading(false);
          } catch (error) {
            console.error("Error creating user:", error);
          }
        } else {
          console.error("User photo not found.");
          setLoading(false);
        }
      }
    };

    setupChatEngine();
  }, [user, navigate]);

  // if (!user || loading) {
  //   return (
  //     <div
  //       style={{
  //         color: "gray",
  //         width: "100vw",
  //         height: "100vh",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <h2>Loading...</h2>
  //     </div>
  //   );
  // }

  return (
    <div className="chat-page">
      <div className="" style={{ backgroundColor: "#002766" }}>
        <div
          className="nav-bar "
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "80%",
            margin: "auto",
            color: "white",
          }}
        >
          <div className="">
            <img
              src="/logo.png"
              alt="logo"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
          <div
            className="wani_chatting_screen"
            style={{ fontSize: "24px", fontStyle: "revert" }}
          >
            University of Juba Chat Application
          </div>
          <div
            className="logoutBtn"
            onClick={handleLogout}
            style={{
              backgroundColor: "blue",
              borderRadius: "15px",
              padding: "8px",
            }}
          >
            Logout
          </div>
        </div>
      </div>
      <ChatEngine
        projectID="e4391406-3e36-445c-831f-58907a0770c2"
        userName={user.displayName}
        userSecret={user.uid}
        height="calc(100vh - 66px)"
      />
    </div>
  );
};

export default Chats;
