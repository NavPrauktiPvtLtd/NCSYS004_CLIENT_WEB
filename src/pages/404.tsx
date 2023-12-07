import PageNotFoundSvg from "@/components/common/svg/PageNotFound";

const Page404 = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem",
        height: "100%",
        background: "#6CB4EE",
      }}
    >
      <div style={{ color: "white", fontSize: "4rem", padding: "2rem" }}>
        Page Not Found
      </div>
      <div>
        <PageNotFoundSvg />
      </div>
    </div>
  );
};

export default Page404;
