import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { Grid } from "@mui/material";
import { signup } from "../../provider/auth";
import "./Signup.scss";

const Signup = () => {
  const success = "user saved";
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [zipcode, setZipCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const navigate = useNavigate();

  const callback = (res) => {
    if (res.data.result == "user saved") navigate("/signin");
  };

  return (
    <>
      <Grid container direction="column" justifyContent="space-between" className="signup-page">
        <Grid item>
          <Header />
        </Grid>
        <Grid item xs={7} container direction="row" justifyContent="center" className="main-form-container">
          <Grid item xs={10} container direction="column" justifyContent="space-evenly" className="main-form">
            <Grid item xs={2} container direction="row" justifyContent="center" alignItems="center" className="title">
              Create an Account
            </Grid>
            <Grid item xs={6} container direction="row" justifyContent="center" className="input-part-container">
              <Grid item xs={7} container direction="column" justifyContent="space-between" className="input-part">
                <Grid item container direction="row" justifyContent="space-around" className="input-row">
                  <Grid item xs={5.6} className="general-input">
                    <Grid item xs={12}>
                      <input
                        placeholder="First Name"
                        className="input-field"
                        value={firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={5.6} className="general-input">
                    <Grid item xs={12}>
                      <input
                        placeholder="Last Name"
                        className="input-field"
                        value={lastname}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item container direction="row" justifyContent="space-around" className="input-row">
                  <Grid item xs={5.6} className="general-input">
                    <Grid item xs={12}>
                      <input
                        placeholder="Date of Birth"
                        className="input-field"
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={5.6}
                    container
                    direction="row"
                    justifyContent="space-between"
                    className="general-input"
                  >
                    <Grid item xs={3}>
                      <div className="prefix-number">+62</div>
                    </Grid>
                    <Grid item xs={8}>
                      <input
                        placeholder="Phone Number"
                        className="input-field"
                        value={phone}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item container direction="row" justifyContent="space-around" className="input-row">
                  <Grid item xs={5.6} className="general-input">
                    <Grid item xs={12}>
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={5.6} className="general-input">
                    <Grid item xs={12}>
                      <input
                        placeholder="Zip Code"
                        className="input-field"
                        value={zipcode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item container direction="row" justifyContent="space-around" className="input-row">
                  <Grid item xs={5.6} className="general-input">
                    <Grid item xs={12}>
                      <input
                        placeholder="Password"
                        type="password"
                        className="input-field"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={5.6} className="general-input">
                    <Grid item xs={12}>
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="input-field"
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3.6} container direction="column" justifyContent="space-around" className="bottom-part">
              <Grid item container justifyContent="center" className="check-text">
                <input type="checkbox" />I agree to Bluffscasino Terms & conditions and Privacy Policy.
              </Grid>
              <Grid item container justifyContent="center">
                <button
                  className="signup-btn"
                  onClick={() =>
                    signup(
                      {
                        firstname,
                        lastname,
                        birth,
                        phone,
                        email,
                        zipcode,
                        pwd,
                      },
                      callback
                    )
                  }
                >
                  Register Now
                </button>
              </Grid>
              <Grid item container justifyContent="center" className="check-text">
                Already have an account? Sign in
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
};

export default Signup;
