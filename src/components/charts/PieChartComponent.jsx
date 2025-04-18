import React, { useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const PieChartComponent = ({ percentage = 0 }) => {
  const data = [
    { name: "Remaining", value: 100 },
    { name: "Filled", value: percentage },
  ];

  
  

  const COLORS = ["#041F621A", "#041F62"];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "auto",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div
      >
        <div
          style={{
            top: 0,
            left: 0,
            flex: "1",
            aspectRatio: "1",
            maxWidth: "300px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ResponsiveContainer className="relative" width="100%" height="100%">
            <div
              style={{
                position: "absolute",
                fontSize: "300%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
                color: "#041F62",
                whiteSpace: "nowrap",
              }}
            >
              {`${percentage?.toFixed()}%`}
            </div>
            <PieChart>
              <Pie
                data={[data[0]]}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={450}
                innerRadius="60%"
                outerRadius="75%"
                dataKey="value"
                stroke="none"
              >
                <Cell fill={COLORS[0]} />
              </Pie>

              <Pie
                data={[data[1]]}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={90 + (360 * percentage) / 100}
                innerRadius="60%"
                outerRadius="75%"
                cornerRadius="50%"
                dataKey="value"
                stroke="none"
              >
                <Cell fill={COLORS[1]} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
