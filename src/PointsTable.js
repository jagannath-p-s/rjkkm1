import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './Styles.css';
import Table from './Table';

const supabaseUrl = 'https://smfonqblavmkgmcylqoc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZm9ucWJsYXZta2dtY3lscW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMjI0MjQsImV4cCI6MjAyNzY5ODQyNH0.Yk9jlcLu2Svi8cAsQLuMJHflvBqbtusICyNj2ZfrVZg'; // Replace with your Supabase API key

const supabase = createClient(supabaseUrl, supabaseKey);

const PointsTable = () => {
  const [pointsData, setPointsData] = useState([]);
  const [filter, setFilter] = useState({
    customerCode: '',
    address1: '',
    mobileNumber: '',
    totalPointsMin: '',
    totalPointsMax: '',
    unclaimedPointsMin: '', // Add unclaimedPointsMin filter
    unclaimedPointsMax: '', // Add unclaimedPointsMax filter
    fromDate: '',
  toDate: '',
    sortBy: 'CUSTOMER CODE',
    sortOrder: 'ASC',
  });
 
  const [showFilters, setShowFilters] = useState(true); // State variable to control filter visibility

  useEffect(() => {
    fetchPointsData();
  }, [filter]); // Update dependency array to include filter

  const fetchPointsData = async () => {
    try {
      let { data, error } = await supabase.from('points').select('*');

      if (error) {
        throw error;
      }

      // Apply filters
      let filteredData = [...data];

      if (filter.customerCode) {
        filteredData = filteredData.filter(point => point["CUSTOMER CODE"].toString().toLowerCase().includes(filter.customerCode.toLowerCase()));
      }
      if (filter.address1) {
        filteredData = filteredData.filter(point => point["ADDRESS1"].toString().toLowerCase().includes(filter.address1.toLowerCase()));
      }
      if (filter.mobileNumber) {
        filteredData = filteredData.filter(point => point["MOBILE"].toString().toLowerCase().includes(filter.mobileNumber.toLowerCase()));
      }
      if (filter.totalPointsMin) {
        filteredData = filteredData.filter(point => point["TOTAL POINTS"] >= filter.totalPointsMin);
      }
      if (filter.totalPointsMax) {
        filteredData = filteredData.filter(point => point["TOTAL POINTS"] <= filter.totalPointsMax);
      }
      if (filter.unclaimedPointsMin) {
        filteredData = filteredData.filter(point => point["UNCLAIMED POINTS"] >= filter.unclaimedPointsMin);
      }
      if (filter.unclaimedPointsMax) {
        filteredData = filteredData.filter(point => point["UNCLAIMED POINTS"] <= filter.unclaimedPointsMax);
      }
// Apply date filters
if (filter.fromDate) {
  filteredData = filteredData.filter(point => new Date(point["LAST SALES DATE"]) >= new Date(filter.fromDate));
}
if (filter.toDate) {
  filteredData = filteredData.filter(point => new Date(point["LAST SALES DATE"]) <= new Date(filter.toDate));
}


      // Apply sorting
      filteredData.sort((a, b) => {
        const valueA = a[filter.sortBy];
        const valueB = b[filter.sortBy];
        if (filter.sortOrder === 'ASC') {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      });

      setPointsData(filteredData);
    } catch (error) {
      console.error('Error fetching points data:', error.message);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      [key]: value,
    }));
  };

  const handleToggleFilters = () => {
    setShowFilters(prevState => !prevState); // Toggle showFilters state
  };

  const handleClaim = async (point) => {
    try {
      const { data, error } = await supabase
        .from('points')
        .update({
          "CLAIMED POINTS": point["CLAIMED POINTS"] + 1,
          "UNCLAIMED POINTS": point["UNCLAIMED POINTS"] - 1,
        })
        .eq('CUSTOMER CODE', point["CUSTOMER CODE"]);
  
      if (error) {
        throw error;
      }
  
      // Update pointsData after successful claim
      const updatedPointsData = pointsData.map(item => {
        if (item["CUSTOMER CODE"] === point["CUSTOMER CODE"]) {
          return {
            ...item,
            "CLAIMED POINTS": item["CLAIMED POINTS"] + 1,
            "UNCLAIMED POINTS": item["UNCLAIMED POINTS"] - 1,
          };
        }
        return item;
      });
  
      setPointsData(updatedPointsData);
      alert('Point claimed successfully!');
    } catch (error) {
      console.error('Error claiming point:', error.message);
      alert('Failed to claim point. Please try again later.');
    }
  };

  return (
    <div className="points-table">
      <button onClick={handleToggleFilters}>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      {showFilters && <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by Customer Code"
          value={filter.customerCode}
          onChange={e => handleFilterChange('customerCode', e.target.value)}
        />
        <input type="date" placeholder="From Date" value={filter.fromDate} onChange={e => handleFilterChange('fromDate', e.target.value)} />
<input type="date" placeholder="To Date" value={filter.toDate} onChange={e => handleFilterChange('toDate', e.target.value)} />
        <input
          type="text"
          placeholder="Filter by Address1"
          value={filter.address1}
          onChange={e => handleFilterChange('address1', e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Mobile Number"
          value={filter.mobileNumber}
          onChange={e => handleFilterChange('mobileNumber', e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Total Points"
          value={filter.totalPointsMin}
          onChange={e => handleFilterChange('totalPointsMin', e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Total Points"
          value={filter.totalPointsMax}
          onChange={e => handleFilterChange('totalPointsMax', e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Unclaimed Points"
          value={filter.unclaimedPointsMin}
          onChange={e => handleFilterChange('unclaimedPointsMin', e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Unclaimed Points"
          value={filter.unclaimedPointsMax}
          onChange={e => handleFilterChange('unclaimedPointsMax', e.target.value)}
        />
        <select
          value={filter.sortBy}
          onChange={e => handleFilterChange('sortBy', e.target.value)}
        >
          <option value="CUSTOMER CODE">Sort by Customer Code</option>
          <option value="TOTAL POINTS">Sort by Total Points</option>
          {/* Add more options for sorting */}
        </select>
        <select
          value={filter.sortOrder}
          onChange={e => handleFilterChange('sortOrder', e.target.value)}
        >
          
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>}
      <Table pointsData={pointsData} handleClaim={handleClaim} />
    </div>
  );
};

export default PointsTable;
