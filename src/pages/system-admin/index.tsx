import { Button, Modal } from "@mantine/core";
import { PageRoutes } from "../../../@types/index.";
import { useNavigate } from "react-router-dom";

import useClickSound from "@/hooks/useClickSound";
import AppAPI, {
  sensorEcg,
  sensorHeight,
  sensorNibp,
  sensorSpo2,
  sensorTemp,
  sensorWeight,
} from "API/AppAPI";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

import RunDiagnosticModal from "@/components/common/RunDiagnosticModal";
import { getRandomNumber, sleep } from "utils";

const SystemAdminPanel = () => {
  const navigate = useNavigate();

  const { playClickSound } = useClickSound();
  const [heightData, setHeightData] = useState<sensorHeight>();
  const [weightData, setWeightData] = useState<sensorWeight>();
  const [tempData, setTempData] = useState<sensorTemp>();
  // const [systemHealthData, setSystemHealthData] = useState<systemHealth>();

  const [systemRamTotal, setSystemRamTotal] = useState<number>();
  const [systemRamConsume, setSystemRamConsume] = useState<number>();
  const [systemHddTotal, setSystemHddTotal] = useState<number>();
  const [systemHddConsume, setSystemHddConsume] = useState<number>();
  const [systemCpuConsume, setSystemCpuConsume] = useState<number>();
  const [networkSpeedDownload, setNetworkSpeedDownload] = useState<number>();
  const [networkSpeedUpload, setNetworkSpeedUpload] = useState<number>();

  const [ecgData, setEcgData] = useState<sensorEcg>();
  const [nibpData, setNibpData] = useState<sensorNibp>();
  const [spo2Data, setSpo2Data] = useState<sensorSpo2>();

  const [heightLoading, setHeightLoading] = useState(false);
  const [weightLoading, setWeightLoading] = useState(false);
  const [tempLoading, setTempLoading] = useState(false);
  // const [systemHealthLoading, setSystemHealthLoading] = useState(false);
  const [ecgLoading, setEcgLoading] = useState(false);
  const [nibpLoading, setNibpLoading] = useState(false);
  const [spo2Loading, setSpo2Loading] = useState(false);

  const [ramTotalLoading, setRamTotalLoading] = useState(false);
  const [ramConsumeLoading, setRamConsumeLoading] = useState(false);
  const [hddTotalLoading, setHddTotalLoading] = useState(false);
  const [hddConsumeLoading, setHddConsumeLoading] = useState(false);
  const [cpuConsumeLoading, setCpuConsumeLoading] = useState(false);
  const [networkSpeedDownloadLoading, setNetworkSpeedDownloadLoading] =
    useState(false);
  const [networkSpeedUploadLoading, setNetworkSpeedUploadLoading] =
    useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const clickWeightCalib = () => {
    playClickSound();
    navigate(PageRoutes.SYSTEM_ADMIN_CALI_WEIGHT);
  };

  const fetchDiagnosticData = async () => {
    open();

    try {
      setHeightLoading(true);
      const heightResponse = await AppAPI.sensorHeight();
      setHeightData(heightResponse.data.data);
      setHeightLoading(false);

      setWeightLoading(true);
      const weightResponse = await AppAPI.sensorWeight();
      setWeightData(weightResponse.data.data);
      setWeightLoading(false);

      setTempLoading(true);
      const tempResponse = await AppAPI.sensorTemp();
      setTempData(tempResponse.data.data);
      setTempLoading(false);

      setSpo2Loading(true);
      const spo2Response = await AppAPI.sensorSpo2();
      setSpo2Data(spo2Response.data.data);
      setSpo2Loading(false);

      setNibpLoading(true);
      const nibpResponse = await AppAPI.sensorNibp();
      setNibpData(nibpResponse.data.data);
      setNibpLoading(false);

      setEcgLoading(true);
      const ecgResponse = await AppAPI.sensorEcg();
      setEcgData(ecgResponse.data.data);
      setEcgLoading(false);

      // setSystemHealthLoading(true);
      // const systemResponse = await AppAPI.systemHealth();
      // setSystemHealthData(systemResponse.data.data);
      // setSystemHealthLoading(false);

      setRamTotalLoading(true);
      const systemResponse = await AppAPI.systemHealth();
      // await sleep(2);
      setSystemRamTotal(systemResponse.data.data.sys_RAM_total);
      setRamTotalLoading(false);

      setRamConsumeLoading(true);
      let num = getRandomNumber(2, 6);
      await sleep(num);
      setSystemRamConsume(systemResponse.data.data.sys_RAM_consume);
      setRamConsumeLoading(false);

      setHddTotalLoading(true);
      num = getRandomNumber(2, 6);
      await sleep(num);
      setSystemHddTotal(systemResponse.data.data.sys_HDD_total);
      setHddTotalLoading(false);

      setHddConsumeLoading(true);
      num = getRandomNumber(2, 6);
      await sleep(num);
      setSystemHddConsume(systemResponse.data.data.sys_HDD_consume);
      setHddConsumeLoading(false);

      setCpuConsumeLoading(true);
      num = getRandomNumber(2, 6);
      await sleep(num);
      setSystemCpuConsume(systemResponse.data.data.sys_CPU_consume);
      setCpuConsumeLoading(false);

      setNetworkSpeedUploadLoading(true);
      num = getRandomNumber(2, 6);
      await sleep(num);
      setNetworkSpeedUpload(systemResponse.data.data.network_speed.upload);
      setNetworkSpeedUploadLoading(false);

      setNetworkSpeedDownloadLoading(true);
      num = getRandomNumber(2, 6);
      await sleep(num);
      setNetworkSpeedDownload(systemResponse.data.data.network_speed.download);
      setNetworkSpeedDownloadLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Initialize default values for state variables
    if (!opened) {
      setHeightData(undefined);
      setWeightData(undefined);
      setTempData(undefined);
      // setSystemHealthData(undefined);
      setSystemRamTotal(undefined);
      setSystemRamConsume(undefined);
      setSystemHddTotal(undefined);
      setSystemHddConsume(undefined);
      setSystemCpuConsume(undefined);
      setNetworkSpeedDownload(undefined);
      setNetworkSpeedUpload(undefined);
      setEcgData(undefined);
      setNibpData(undefined);
      setSpo2Data(undefined);
      setHeightLoading(false);
      setWeightLoading(false);
      setTempLoading(false);
      // setSystemHealthLoading(false);
      setEcgLoading(false);
      setNibpLoading(false);
      setSpo2Loading(false);
      setRamTotalLoading(false);
      setRamConsumeLoading(false);
      setHddTotalLoading(false);
      setHddConsumeLoading(false);
      setCpuConsumeLoading(false);
      setNetworkSpeedDownloadLoading(false);
      setNetworkSpeedUploadLoading(false);
    }
  }, [opened]);

  return (
    <div style={{ background: "whitesmoke", textTransform: "uppercase" }}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <Button onClick={clickWeightCalib} size="xl" uppercase>
            Click here for Weight Calibration
          </Button>
          <Button onClick={fetchDiagnosticData} size="xl" uppercase>
            Run Diagnostic
          </Button>
          <Button size="xl" uppercase>
            <a href="/">Home</a>
          </Button>

          <Modal
            opened={opened}
            closeOnClickOutside={false}
            onClose={close}
            centered
            size="xl"
          >
            <RunDiagnosticModal
              heightData={heightData}
              weightData={weightData}
              nibpData={nibpData}
              tempData={tempData}
              // systemHealthData={systemHealthData}
              ecgData={ecgData}
              spo2Data={spo2Data}
              systemRamTotal={systemRamTotal}
              systemRamConsume={systemRamConsume}
              systemHddTotal={systemHddTotal}
              systemHddConsume={systemHddConsume}
              systemCpuConsume={systemCpuConsume}
              networkSpeedDownload={networkSpeedDownload}
              networkSpeedUpload={networkSpeedUpload}
              heightLoading={heightLoading}
              weightLoading={weightLoading}
              tempLoading={tempLoading}
              // systemHealthLoading={systemHealthLoading}
              ecgLoading={ecgLoading}
              nibpLoading={nibpLoading}
              spo2Loading={spo2Loading}
              ramTotalLoading={ramTotalLoading}
              ramConsumeLoading={ramConsumeLoading}
              hddTotalLoading={hddTotalLoading}
              hddConsumeLoading={hddConsumeLoading}
              cpuConsumeLoading={cpuConsumeLoading}
              networkSpeedDownloadLoading={networkSpeedDownloadLoading}
              networkSpeedUploadLoading={networkSpeedUploadLoading}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminPanel;
