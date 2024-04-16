import React, { useEffect } from "react";
import "../styles/Login.css";

const Login = () => {

  useEffect(() => {
    document.title = "Complaint Management Portal - Login";
  }, []);

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="text-center mb-4">
            <img src="./Sikayat2.png" className="img-fluid" alt="brand logo" />
        </div>
      </div>
    </section>
  );
};

export default Login;
