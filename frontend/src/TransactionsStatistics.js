// TransactionsStatistics.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionsStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2021");
  const [selectedMonth, setSelectedMonth] = useState("01"); // Default to January

  useEffect(() => {
    fetchStatistics();
  }, [selectedYear, selectedMonth]);
  const fetchStatistics = async () => {
    try {
      const response = await axios.get("http://localhost:3000/statistics", {
        params: {
          selectedMonth: `${selectedYear}-${selectedMonth}`,
        },
      });

      setStatistics(response.data);
      console.log(statistics);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Transactions Statistics</h2>
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
      <div>TotalSaleAmount: {statistics.totalSaleAmount}</div>
      <div>TotalSaleAmount: {statistics.totalSoldItems}</div>
      <div>TotalSaleAmount: {statistics.totalNotSoldItems}</div>
    </div>
  );
};

export default TransactionsStatistics;
