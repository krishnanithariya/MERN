import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";
import reportWebVitals from "./reportWebVitals";
import TransactionsBarChart from "./TransactionsBarChart";
// import TransactionsStatistics from "./TransactionsStatistics";
// import TransactionsTable from "./TransactionsTable.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <TransactionsTable /> */}
    {/* <TransactionsStatistics /> */}
    <TransactionsBarChart />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
