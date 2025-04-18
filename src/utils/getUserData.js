// import { useEffect } from "react";

// export function getUserData() {
//     const userInfo = localStorage.getItem("userInfo");


//     useEffect(() => {
//      console.log(userInfo);
     
//     }, [userInfo])
    

//     if (userInfo) {
//         try {
//             return JSON.parse(userInfo);
//         } catch (error) {
//             console.error("Error parsing userInfo from localStorage:", error);
//             return null;
//         }
//     }

//     console.log("No user data found in localStorage.");
//     return null;
// }





import { useState, useEffect } from "react";

export function getUserData() {
    const [userInfo, setUserInfo] = useState(() => {
        // Initialize state with data from localStorage
        const storedUserInfo = localStorage.getItem("userInfo");
        return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    });

    useEffect(() => {
        // Function to handle localStorage updates
        const handleStorageChange = () => {
            const updatedUserInfo = localStorage.getItem("userInfo");
            setUserInfo(updatedUserInfo ? JSON.parse(updatedUserInfo) : null);
        };

        // Listen for changes in localStorage
        window.addEventListener("storage", handleStorageChange);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        // React to local state changes if needed
        console.log("User Info updated:", userInfo);
    }, [userInfo]);

    return userInfo;
}
