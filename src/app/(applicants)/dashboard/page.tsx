import { logoutUserAction } from "@/features/auth/server/auth.actions";
import React from "react";

const ApplicantDashboard = () => {
  return (
    <div>
      <h1>Hello Applicant Dashboard</h1>
      <button onClick={logoutUserAction} style={{ cursor: "pointer" }}>
        Logout
      </button>
    </div>
  );
};

export default ApplicantDashboard;
