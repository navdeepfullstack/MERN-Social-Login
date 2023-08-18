import {
    GET_DEALERS,
    GET_DEALER,
    CREATE_DEALER,
    LOGIN_DEALER,
    LOGOUT_DEALER,
    MODAL_STATE,
    SELECT_COMPONENT,
    BACK_COMPONENT
  } from "../constants/constants";
  import Cookies from "universal-cookie";
  
  const prodURL = process.env.REACT_APP_PROD_URL;
  const devURL = process.env.REACT_APP_DEV_URL;
  const environment = process.env.REACT_APP_ENVIRONMENT;
  const url = environment === "production" ? prodURL : devURL;

  
  
  export const socialLogin = (dealer) => {
    return async (dispatch) => {
      try {
        const response = await fetch(`${url}dealer/socialLogin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dealer),
        });
  
        if (response.ok) {
          const data = await response.json();
  
          const dealer = {
            accountDetails: data.data.newDealer,
            token: data.data.token,
          };
          dispatch({ type: CREATE_DEALER, payload: dealer });
          const cookies = new Cookies();
          const today = new Date();
          const tomorrow = new Date(today);
          const expiryDate = new Date(tomorrow.setDate(tomorrow.getDate() + 1));
          cookies.set("jwt", data.data.token, { expires: expiryDate });
          cookies.set("user", data.data.newDealer, { expires: expiryDate });
          return { status: "success", id: data.data.newDealer._id };
        } else {
          const data = await response.json();
  
          if (data.error.code === 11000) {
            console.log("error: ", data.error.code);
            console.log(
              "Account  already exists. Please log in or sign up with another email"
            );
            return {
              status: "error",
              error:
                "Account with similar email already exists. Please log in or sign up with another email",
            };
          }
          if (data.error.details[0].context.key === "password") {
            return {
              status: "error",
              error:
                "Please make sure you type at least 8 characters for the password",
            };
          }
          return { status: "error", error: data.error };
        }
      } catch (error) {
        console.log(error);
      }
    };
  };
  
  
  export const toggleModal = (bool) => {
    if (!bool) {
      document.body.classList.remove('overflow_hidden');
    }
    else {
      document.body.classList.add('overflow_hidden');
    }
    return async (dispatch) => {
      dispatch({ type: MODAL_STATE, payload: bool })
    }
  }
  
  export const selectComponent = (val) => {
    return async (dispatch) => {
      dispatch({ type: SELECT_COMPONENT, payload: val })
    }
  }

  