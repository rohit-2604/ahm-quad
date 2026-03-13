import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../utils/Popup/ErrorPupup/ErrorPopup";



// const domain = "http://192.168.1.64:5000";
export const domain = 'http://localhost:3000';
// export const domain = "https://bhilai-ahm-backend.iemamerica.com";
const ErrorPopupContext = createContext();

// export const useErrorPopup = () => useContext(ErrorPopupContext);



export const usePost = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const { showErrorPopup } = useErrorPopup();
  const postRequest = async (url, body, token = null) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${domain}${url}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const json = await response.json().catch(() => ({}));
      const { success, message, data } = json;

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          // navigate("/");
        }
        if(message ==="jwt expired"||message ==="jwt malformed") {
          // showErrorPopup("session timeout");
          
           localStorage.clear();
          //  navigate("/");
          
        }
        throw new Error((message?message:response.statusText) || "An error occurred");
      }

      if (!success) {
        // showErrorPopup("some error occurred");
        throw new Error(message || "An error occurred");
        
      
      }

      return json;
    } catch (err) {
      if(err.message ==="jwt expired"||err.message==="jwt malformed") {
        // showErrorPopup("session timeout");
        localStorage.clear();
        // navigate("/");
        
      }
      else{
      // showErrorPopup(err.message);
      }
      console.error(err);

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { postRequest, isLoading };
};

export const useDelete = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const { showErrorPopup } = useErrorPopup();

  const deleteRequest = async (url, token = null) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${domain}${url}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const json = await response.json().catch(() => ({}));
      const { success, message, data } = json;

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          // navigate("/");
        }
        if(message ==="jwt expired"||message ==="jwt malformed") {
          // showErrorPopup("session timeout");
          
          localStorage.clear();
          // navigate("/");
          
        }
        throw new Error((message?message:response.statusText) || "An error occurred");
      }

      if (!success) {
        // showErrorPopup("some error occurred");
        throw new Error(message || "An error occurred");
      }

      return json;
    } catch (err) {
      if(err.message ==="jwt expired"||err.message==="jwt malformed") {
        // showErrorPopup("session timeout");
        localStorage.clear();
        // navigate("/");
        
      }
      else{
      // showErrorPopup(err.message);
      }
      console.error(err);

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteRequest, isLoading };
};







export const useGet = (domain) => {
  const [isLoading, setIsLoading] = useState(false);

  const getRequest = async (url, token = null) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${domain}${url}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const { success, message, data } = await response.json();

      setIsLoading(false);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          // navigate("/");
        }
        throw new Error(message);
      }

      if (!success) {
        throw new Error(message);
      }

      return data;
    } catch (err) {
      setIsLoading(false);

      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { getRequest, isLoading };
};







