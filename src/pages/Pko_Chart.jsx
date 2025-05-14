import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const Pko_Chart = ({ labels, data, chartName }) => {
  const totalSKUs = data.reduce((a, b) => a + b, 0); // Calculate total SKUs
  const inReviewSKUs = data[2] || 0; // Assuming "Completed" is the third item

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor:
          chartName === "PKOs"
            ? ["#EDEDED", "#257CFF", "#28a745"]
            : ["#EDEDED", "#257CFF", "#FEB343", "#28a745"], // Not Started, Draft, Inreview, Approved
        hoverBackgroundColor:
          chartName === "PKOs"
            ? ["#8C8C8C", "#1A5FD3", "#1e7e34"]
            : ["#8C8C8C", "#1A5FD3", "#e09a21", "#1e7e34"],
        borderWidth: 1, // Add slight border for better segmentation
        cutout: "68%", // Adjust thickness for a cleaner look
      },
    ],
  };

  const options = {
    cutout: "65%", // Controls the thickness of the donut
    plugins: {
      legend: {
        display: false, // Hide legend since we have external labels
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
          title: () => "", // Remove the bold title from tooltip
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        position: "relative",
        width: chartName === "SKU" ? "130px" : "180px",
        height: chartName === "SKU" ? "130px" : "180px",
        margin: "0 auto",
      }}
    >
      <Doughnut data={chartData} options={options} />
      {/* Center Text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontSize: "14px",
          fontWeight: "600",
          color: "#6C757D",
        }}
      >
        <p style={{ margin: "0" }}>
          {chartName === "PKOs" ? data[2] || 0 : chartName === "SKU" ? data[3] || 0 : inReviewSKUs} {chartName}
        </p>
        <p style={{ margin: "0" }}> {chartName === "PKOs" || chartName === "SKU" ? "Approved" : "In Review"}</p>
      </div>
    </div>
  );
};

export default Pko_Chart;