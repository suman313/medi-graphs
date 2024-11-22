import React, { useRef, useState, useEffect } from "react";
import classes from "./styles/styles.scss";
import "./styles/style.css";

import {
  CategoryAxis,
  EllipsePointMarker,
  FastLineRenderableSeries,
  NumberRange,
  NumericAxis,
  RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
  SciChartJsNavyTheme,
  SciChartSurface,
  XyDataSeries,
} from "scichart";
import { vitalSignsEcgData } from "./data/vitalSignsEcgData";

SciChartSurface.loadWasmFromCDN();
const divElementId = "chart";
const STEP = 10;
const TIMER_TIMEOUT_MS = 20;
const STROKE_THICKNESS = 4;
const POINTS_LOOP = 5200;
const GAP_POINTS = 50;
const DATA_LENGTH = vitalSignsEcgData.xValues.length;

const {
  ecgHeartRateValues,
  bloodPressureValues,
  bloodVolumeValues,
  bloodOxygenationValues,
} = vitalSignsEcgData;

// Helper function to get values
const getValuesFromData = (xIndex) => {
  const xArr = [];
  const ecgHeartRateArr = [];
  const bloodPressureArr = [];
  const bloodVolumeArr = [];
  const bloodOxygenationArr = [];
  for (let i = 0; i < STEP; i++) {
    const dataIndex = (xIndex + i) % DATA_LENGTH;
    const x = xIndex + i;
    xArr.push(x);
    ecgHeartRateArr.push(ecgHeartRateValues[dataIndex]);
    bloodPressureArr.push(bloodPressureValues[dataIndex]);
    bloodVolumeArr.push(bloodVolumeValues[dataIndex]);
    bloodOxygenationArr.push(bloodOxygenationValues[dataIndex]);
  }
  return {
    xArr,
    ecgHeartRateArr,
    bloodPressureArr,
    bloodVolumeArr,
    bloodOxygenationArr,
  };
};

const drawExample = async (
  setInfoEcg,
  setInfoBloodPressure1,
  setInfoBloodPressure2,
  setInfoBloodVolume,
  setInfoBloodOxygenation
) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElementId,

    {
      watermarkRelativeToCanvas: false,
      theme: new SciChartJsNavyTheme(),
    }
  );

  const xAxis = new CategoryAxis(wasmContext, {
    visibleRange: new NumberRange(0, POINTS_LOOP),
    isVisible: true,
  });
  sciChartSurface.xAxes.add(xAxis);

  const yAxisHeartRate = new NumericAxis(wasmContext, {
    id: "yHeartRate",
    visibleRange: new NumberRange(0.7, 1.0),
    isVisible: true,
  });
  const yAxisBloodPressure = new NumericAxis(wasmContext, {
    id: "yBloodPressure",
    visibleRange: new NumberRange(0.4, 0.8),
    isVisible: false,
  });
  const yAxisBloodVolume = new NumericAxis(wasmContext, {
    id: "yBloodVolume",
    visibleRange: new NumberRange(0.1, 0.5),
    isVisible: false,
  });
  const yAxisBloodOxygenation = new NumericAxis(wasmContext, {
    id: "yBloodOxygenation",
    visibleRange: new NumberRange(0, 0.2),
    isVisible: false,
  });
  sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
    new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();
  sciChartSurface.yAxes.add(
    yAxisHeartRate
    // yAxisBloodPressure,
    // yAxisBloodVolume,
    // yAxisBloodOxygenation
  );

  const fifoSweepingGap = GAP_POINTS;
  const dataSeries1 = new XyDataSeries(wasmContext, {
    fifoCapacity: POINTS_LOOP,
    fifoSweeping: true,
    fifoSweepingGap,
  });
  const dataSeries2 = new XyDataSeries(wasmContext, {
    fifoCapacity: POINTS_LOOP,
    fifoSweeping: true,
    fifoSweepingGap,
  });
  const dataSeries3 = new XyDataSeries(wasmContext, {
    fifoCapacity: POINTS_LOOP,
    fifoSweeping: true,
    fifoSweepingGap,
  });
  const dataSeries4 = new XyDataSeries(wasmContext, {
    fifoCapacity: POINTS_LOOP,
    fifoSweeping: true,
    fifoSweepingGap,
  });

  const pointMarkerOptions = {
    width: 20,
    height: 20,
    strokeThickness: 2,
    fill: "#83D2F5",
    lastPointOnly: true,
  };

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      yAxisId: yAxisHeartRate.id,
      strokeThickness: STROKE_THICKNESS,
      stroke: "#F48420",
      dataSeries: dataSeries1,
      pointMarker: new EllipsePointMarker(wasmContext, {
        ...pointMarkerOptions,
        stroke: "#F48420",
      }),
    })
  );

  // sciChartSurface.renderableSeries.add(
  //   new FastLineRenderableSeries(wasmContext, {
  //     yAxisId: yAxisBloodPressure.id,
  //     strokeThickness: STROKE_THICKNESS,
  //     stroke: "#50C7E0",
  //     dataSeries: dataSeries2,
  //     pointMarker: new EllipsePointMarker(wasmContext, {
  //       ...pointMarkerOptions,
  //       stroke: "#50C7E0",
  //     }),
  //   })
  // );

  // sciChartSurface.renderableSeries.add(
  //   new FastLineRenderableSeries(wasmContext, {
  //     yAxisId: yAxisBloodVolume.id,
  //     strokeThickness: STROKE_THICKNESS,
  //     stroke: "#EC0F6C",
  //     dataSeries: dataSeries3,
  //     pointMarker: new EllipsePointMarker(wasmContext, {
  //       ...pointMarkerOptions,
  //       stroke: "#EC0F6C",
  //     }),
  //   })
  // );

  // sciChartSurface.renderableSeries.add(
  //   new FastLineRenderableSeries(wasmContext, {
  //     yAxisId: yAxisBloodOxygenation.id,
  //     strokeThickness: STROKE_THICKNESS,
  //     stroke: "#30BC9A",
  //     dataSeries: dataSeries4,
  //     pointMarker: new EllipsePointMarker(wasmContext, {
  //       ...pointMarkerOptions,
  //       stroke: "#30BC9A",
  //     }),
  //   })
  // );

  let timerId;

  const runUpdateDataOnTimeout = () => {
    const {
      xArr,
      ecgHeartRateArr,
      bloodPressureArr,
      bloodVolumeArr,
      bloodOxygenationArr,
    } = getValuesFromData(currentPoint);
    currentPoint += STEP;

    dataSeries1.appendRange(xArr, ecgHeartRateArr);
    dataSeries2.appendRange(xArr, bloodPressureArr);
    dataSeries3.appendRange(xArr, bloodVolumeArr);
    dataSeries4.appendRange(xArr, bloodOxygenationArr);

    if (currentPoint % 1000 === 0) {
      setInfoEcg(Math.floor(ecgHeartRateArr[STEP - 1] * 40));
      setInfoBloodPressure1(Math.floor(bloodPressureArr[STEP - 1] * 46));
      setInfoBloodPressure2(Math.floor(bloodPressureArr[STEP - 1] * 31));
      setInfoBloodVolume(bloodVolumeArr[STEP - 1] + 11.6);
      setInfoBloodOxygenation(
        Math.floor(bloodOxygenationArr[STEP - 1] * 10 + 93)
      );
    }
    timerId = setTimeout(runUpdateDataOnTimeout, TIMER_TIMEOUT_MS);
  };

  const handleStop = () => {
    clearTimeout(timerId);
  };

  const handleStart = () => {
    handleStop();
    runUpdateDataOnTimeout();
  };

  return {
    sciChartSurface,
    wasmContext,
    controls: { handleStart, handleStop },
  };
};

let currentPoint = 0;

export default function VitalSignsMonitorDemo() {
  const sciChartSurfaceRef = useRef();
  const controlsRef = useRef();

  const [infoEcg, setInfoEcg] = useState(0);
  const [infoBloodPressure1, setInfoBloodPressure1] = useState(0);
  const [infoBloodPressure2, setInfoBloodPressure2] = useState(0);
  const [infoBloodVolume, setInfoBloodVolume] = useState(0);
  const [infoBloodOxygenation, setInfoBloodOxygenation] = useState(0);

  useEffect(() => {
    let autoStartTimerId;

    const chartInitializationPromise = drawExample(
      setInfoEcg,
      setInfoBloodPressure1,
      setInfoBloodPressure2,
      setInfoBloodVolume,
      setInfoBloodOxygenation
    ).then((res) => {
      sciChartSurfaceRef.current = res.sciChartSurface;
      controlsRef.current = res.controls;
      autoStartTimerId = setTimeout(res.controls.handleStart, 0);
    });

    return () => {
      if (sciChartSurfaceRef.current) {
        clearTimeout(autoStartTimerId);
        controlsRef.current.handleStop();
        sciChartSurfaceRef.current.delete();
        return;
      }

      chartInitializationPromise.then(() => {
        clearTimeout(autoStartTimerId);
        controlsRef.current.handleStop();
        sciChartSurfaceRef.current.delete();
      });
    };
  }, []);

  return (
    <div>
      <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
        <div id={divElementId} style={{ flex: "1" }}></div>
        <div style={{ width: "200px", marginLeft: "10px", marginTop: "15px" }}>
          <p className={classes.Title}>Ecg: {infoEcg}</p>
          {/* <p className={classes.Title}>
            Blood Pressure: {infoBloodPressure1}/{infoBloodPressure2}
          </p>
          <p className={classes.Title}>
            Blood Volume: {infoBloodVolume.toFixed(1)} l
          </p>
          <p className={classes.Title}>
            Blood Oxygenation: {infoBloodOxygenation} %
          </p> */}
        </div>
      </div>
    </div>
  );
}
