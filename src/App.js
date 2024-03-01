import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const resultsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setTotalPages(Math.ceil(customers.length / resultsPerPage));
  }, [customers]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const SortDataByDate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers/sort_by_date`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        console.log("sfdgfhnbdw3rthbcxsthbv", data);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const SortDataByTime = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers/sort_by_time`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        console.log("sfdgfhnbdw3rthbcxsthbv", data);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers/search?query=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        console.log(data)
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (e) =>{
    setSortBy(e.target.value);
    
  }
  
  const handleSortConfirmChange = () => {
    if (sortBy == "date"){
      SortDataByDate();
    }else if (sortBy == "time"){
      SortDataByTime();
    }

  }

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = customers.slice(startIndex, endIndex);

  return (
    <div className="App">
      <h1 className='header'>Customer List</h1>
      <div className='main-container'>
        <div className='search-container'>
            <input
            className='search'
            type="text"
            placeholder="Search Customer Name or Location ...."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>Search</button> 
        </div>
        <div className="sort-container">
        <span className='head'><b>SORT BY</b></span>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="">Sort by</option>
          <option value="date"><b>DATE</b></option>
          <option value="time"><b>TIME</b></option> 
        </select>
        <button onClick={handleSortConfirmChange}>Sort</button>
      </div>
      </div>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {customers && currentResults.map((customer) => (
            <tr key={customer.sno}>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(totalPages).keys()].map((page) => (
          <button key={page} onClick={() => handlePageChange(page + 1)}>
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
