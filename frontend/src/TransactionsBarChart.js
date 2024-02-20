import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const TransactionsBarChart = () => {
  const [barChart, setBarChart] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2021");
  const [selectedMonth, setSelectedMonth] = useState("01"); // Default to January

  useEffect(() => {
    fetchBarChart();
  }, [selectedYear, selectedMonth]);
  const fetchBarChart = async () => {
    try {
      const response = await axios.get("http://localhost:3000/bar-chart", {
        params: {
          selectedMonth: `${selectedYear}-${selectedMonth}`,
        },
      });

      setBarChart(response.data);
      console.log(barChart);
    } catch (error) {
      console.error(error);
    }
  };

  const labels = barChart.map((data) => data.range);
  const dataCounts = barChart.map((data) => data.count);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Number of Items",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.4)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: dataCounts,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category",
        title: { display: true, text: "Price Range" },
      },
      y: { title: { display: true, text: "Number of Items" } },
    },
  };

  return (
    <div>
      <h2>Transactions Bar Chart</h2>
      <form>
        <label>Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
        </select>
        <label>Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <input type="submit" value="Filter Transactions" />
      </form>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TransactionsBarChart;
