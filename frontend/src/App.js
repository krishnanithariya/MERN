// App.js
import React from "react";
import TransactionsTable from "./TransactionsTable.js";
import TransactionsStatistics from "./TransactionsStatistics.js";
import TransactionsBarChart from "./TransactionsBarChart.js";

const App = () => {
  return (
    <div>
      <TransactionsTable />
      <TransactionsStatistics />
      <TransactionsBarChart />
    </div>
  );
};

export default App;
