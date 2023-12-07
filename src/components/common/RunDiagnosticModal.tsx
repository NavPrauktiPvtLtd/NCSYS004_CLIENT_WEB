import { Loader } from "@mantine/core";
import {
  sensorEcg,
  sensorHeight,
  sensorNibp,
  sensorSpo2,
  sensorTemp,
  sensorWeight,
} from "API/AppAPI";
import { FcCancel } from "react-icons/fc";
import { TiTick } from "react-icons/ti";
import { roundedNumber } from "utils";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

interface sensorData {
  heightData: sensorHeight | undefined;
  weightData: sensorWeight | undefined;
  tempData: sensorTemp | undefined;
  // systemHealthData: systemHealth | undefined;
  ecgData: sensorEcg | undefined;
  nibpData: sensorNibp | undefined;
  spo2Data: sensorSpo2 | undefined;
  systemRamTotal: number | undefined;
  systemRamConsume: number | undefined;
  systemHddTotal: number | undefined;
  systemHddConsume: number | undefined;
  systemCpuConsume: number | undefined;
  networkSpeedDownload: number | undefined;
  networkSpeedUpload: number | undefined;

  heightLoading: boolean;
  weightLoading: boolean;
  tempLoading: boolean;
  // systemHealthLoading: boolean;
  ecgLoading: boolean;
  nibpLoading: boolean;
  spo2Loading: boolean;

  ramTotalLoading: boolean;
  ramConsumeLoading: boolean;
  hddTotalLoading: boolean;
  hddConsumeLoading: boolean;
  cpuConsumeLoading: boolean;
  networkSpeedDownloadLoading: boolean;
  networkSpeedUploadLoading: boolean;
}
const RunDiagnosticModal = ({
  heightData,
  weightData,
  tempData,
  // systemHealthData,
  ecgData,
  nibpData,
  spo2Data,
  systemRamTotal,
  systemRamConsume,
  systemHddTotal,
  systemHddConsume,
  systemCpuConsume,
  networkSpeedDownload,
  networkSpeedUpload,

  heightLoading,
  weightLoading,
  tempLoading,
  // systemHealthLoading,
  ecgLoading,
  nibpLoading,
  spo2Loading,
  ramTotalLoading,
  ramConsumeLoading,
  hddTotalLoading,
  hddConsumeLoading,
  cpuConsumeLoading,
  networkSpeedDownloadLoading,
  networkSpeedUploadLoading,
}: sensorData) => {
  return (
    <div style={{ background: "whitesmoke", textTransform: "uppercase" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Diagnostic Data</h1>
        <div style={{ margin: "0 auto" }}>
          <table style={{ minWidth: "60vw", borderCollapse: "collapse" }}>
            <tbody>
              <tr
                style={{
                  backgroundColor: "#f3f4f6",
                }}
              >
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Sensor Height
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {heightLoading ? (
                    <Loader />
                  ) : heightData ? (
                    heightData.sensor_height === true ? (
                      <TiTick
                        style={{ color: "#34D399", fontSize: "1.75rem " }}
                      />
                    ) : (
                      <FcCancel style={{ fontSize: "1.75rem " }} />
                    )
                  ) : null}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Sensor Weight
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {weightLoading ? (
                    <Loader />
                  ) : weightData ? (
                    weightData.sensor_weight === true ? (
                      <TiTick
                        style={{ color: "#34D399", fontSize: "1.75rem " }}
                      />
                    ) : (
                      <FcCancel style={{ fontSize: "1.75rem " }} />
                    )
                  ) : null}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Sensor Temperature
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {tempLoading ? (
                    <Loader />
                  ) : tempData ? (
                    tempData.sensor_temp === true ? (
                      <TiTick
                        style={{ color: "#34D399", fontSize: "1.75rem " }}
                      />
                    ) : (
                      <FcCancel style={{ fontSize: "1.75rem " }} />
                    )
                  ) : null}
                </td>
              </tr>

              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Sensor SpO2
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {spo2Loading ? (
                    <Loader />
                  ) : spo2Data ? (
                    spo2Data.sensor_spo2 === true ? (
                      <TiTick
                        style={{ color: "#34D399", fontSize: "1.75rem " }}
                      />
                    ) : (
                      <FcCancel style={{ fontSize: "1.75rem " }} />
                    )
                  ) : null}
                </td>
              </tr>

              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Sensor BP
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {nibpLoading ? (
                    <Loader />
                  ) : nibpData ? (
                    nibpData.sensor_NIBP === true ? (
                      <TiTick
                        style={{ color: "#34D399", fontSize: "1.75rem " }}
                      />
                    ) : (
                      <FcCancel style={{ fontSize: "1.75rem " }} />
                    )
                  ) : null}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Sensor ECG
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {ecgLoading ? (
                    <Loader />
                  ) : ecgData ? (
                    ecgData.sensor_ecg === true ? (
                      <TiTick
                        style={{ color: "#34D399", fontSize: "1.75rem " }}
                      />
                    ) : (
                      <FcCancel style={{ fontSize: "1.75rem " }} />
                    )
                  ) : null}
                </td>
              </tr>

              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  System RAM Total
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {ramTotalLoading && !systemRamTotal ? (
                    <Loader />
                  ) : (
                    <div style={{ fontSize: "1.75rem" }}>
                      {roundedNumber(systemRamTotal)}GB
                    </div>
                  )}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  System RAM Consume
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {ramConsumeLoading && !systemRamConsume ? (
                    <Loader />
                  ) : (
                    <div style={{ fontSize: "1.75rem" }}>
                      {roundedNumber(systemRamConsume)}GB
                    </div>
                  )}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  System HDD total
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {hddTotalLoading && !systemHddTotal ? (
                    <Loader />
                  ) : (
                    <div style={{ fontSize: "1.75rem" }}>
                      {roundedNumber(systemHddTotal)}GB
                    </div>
                  )}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  System HDD Consume
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {hddConsumeLoading && !systemHddConsume ? (
                    <Loader />
                  ) : (
                    <div style={{ fontSize: "1.75rem" }}>
                      {roundedNumber(systemHddConsume)}GB
                    </div>
                  )}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  System CPU Consume
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {cpuConsumeLoading && !systemCpuConsume ? (
                    <Loader />
                  ) : (
                    <div style={{ fontSize: "1.75rem" }}>
                      {roundedNumber(systemCpuConsume)}%
                    </div>
                  )}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Network Speed
                </td>
                <td
                  style={{
                    padding: "0.75rem 1.5rem",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", fontSize: "1.75rem" }}>
                    <div>
                      <FaArrowUp
                        style={{ color: "blue", marginRight: "5px" }}
                      />
                    </div>
                    <div>
                      {networkSpeedUploadLoading && !networkSpeedUpload ? (
                        <Loader />
                      ) : (
                        <div>{roundedNumber(networkSpeedUpload)}Mbps</div>
                      )}{" "}
                    </div>
                  </div>
                  <div style={{ display: "flex", fontSize: "1.75rem" }}>
                    <div>
                      <FaArrowDown
                        style={{ color: "green", marginRight: "5px" }}
                      />
                    </div>
                    <div>
                      {networkSpeedDownloadLoading && !networkSpeedDownload ? (
                        <Loader />
                      ) : (
                        <div>{roundedNumber(networkSpeedDownload)}Mbps</div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RunDiagnosticModal;
