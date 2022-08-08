import axios from "axios";

//Function to log a user out of their account and invalidate their JWT token
async function Logout() {
    try {
        const response = await axios.get("/user/logout");

        let status = response.status;

        if (status == 200) {
            if (response.data.errorMessage !== undefined) {
                return response.data.errorMessage;
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default Logout;