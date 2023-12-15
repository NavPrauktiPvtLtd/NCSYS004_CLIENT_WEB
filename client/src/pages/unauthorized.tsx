import UnauthorizedSvg from "@/components/common/svg/Unauthorized";

import * as React from "react";

const Unauthorized = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem",
        background: "#6CB4EE",
      }}
    >
      <div style={{ color: "white", fontSize: "4rem", padding: "2rem" }}>
        Access Denied
      </div>
      <div>
        <UnauthorizedSvg />
      </div>
    </div>
  );
};

export default Unauthorized;
