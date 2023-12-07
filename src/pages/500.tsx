import ErrorSvg from "@/components/common/svg/Error";

const ErrorPage500 = () => {
  return (
    <div style={{ background: "white" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            color: "black",
            fontSize: "2rem",
            paddingTop: "4rem",
            fontFamily: "OpenSans",
          }}
        >
          Oops!!! Something Went Wrong
        </p>
        <ErrorSvg />
      </div>
    </div>
  );
};

export default ErrorPage500;
