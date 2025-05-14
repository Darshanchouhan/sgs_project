import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const ProgressLoader = ({ percentage, size = 130, isVendorPage = false }) => {
  const chartData = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#cb122d", "#E0E0E0"], // Filled color and remaining color
        borderWidth: 0,
        cutout: isVendorPage ? "75%" : "80%", // Thicker for vendor, thinner otherwise
      },
    ],
  };

  const options = {
    cutout: isVendorPage ? "75%" : "80%", // Adjust thickness
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        // margin: "0 auto",
      }}
      className={`progress-loader-wrapper me-12 ${isVendorPage ? "vendor-loader" : "pkg-loader"}`}
    >
      <Doughnut data={chartData} options={options} />

      {/* Center Text */}
      {isVendorPage && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            fontWeight: "600",
            color: "#676767",
            textAlign: "center",
          }}
        >
          <span className="fs-24 fw-700 text-secondary">{percentage}%</span>{" "}
          <br /> completed
        </div>
      )}
    </div>
  );
};

export default ProgressLoader;
