// TransactionsTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2021");
  const [selectedMonth, setSelectedMonth] = useState("01"); // Default to January
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [selectedYear, selectedMonth, page]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:3000/transactions", {
        params: {
          page,
          perPage: 10,
          selectedMonth: `${selectedYear}-${selectedMonth}`,
        },
      });
      const docsArray = response.data.docs;
      console.log(docsArray);

      // Convert response.data to an array of entries
      const transactionsArray = docsArray.map((doc) => ({
        id: doc.id,
        title: doc.title,
        price: doc.price,
        description: doc.description,
        category: doc.category,
        image: doc.image,
        sold: doc.sold,
        dateOfSale: doc.dateOfSale,
      }));

      setTransactions(transactionsArray);
      console.log(transactionsArray);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <h2>Transactions Table</h2>
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
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Image</th>
            <th>Sold</th>
            <th>dateOfSale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.price}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>{transaction.image}</td>
              <td>{transaction.sold.toString()}</td>
              <td>{transaction.dateOfSale}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handlePrevPage}>Previous</button>
      <button onClick={handleNextPage}>Next</button>
    </div>
  );
};

export default TransactionsTable;
