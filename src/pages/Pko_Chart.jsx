import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const Pko_Chart = ({ labels, data }) => {
  const totalSKUs = data.reduce((a, b) => a + b, 0); // Calculate total SKUs
  const completedSKUs = data[2] || 0; // Assuming "Completed" is the third item

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ["#EDEDED", "#257CFF", "#30AB30"], // Colors: Not Started, Draft, Completed
        hoverBackgroundColor: ["#8C8C8C", "#257CFF", "#1E7B1E"], // Slightly darker on hover
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
        width: "200px",
        height: "200px",
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
        <p style={{ margin: "0" }}>{completedSKUs} SKUs</p>
        <p style={{ margin: "0" }}>completed</p>
      </div>
    </div>
  );
};

export default Pko_Chart;
