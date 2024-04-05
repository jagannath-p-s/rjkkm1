import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smfonqblavmkgmcylqoc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZm9ucWJsYXZta2dtY3lscW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMjI0MjQsImV4cCI6MjAyNzY5ODQyNH0.Yk9jlcLu2Svi8cAsQLuMJHflvBqbtusICyNj2ZfrVZg'; // Replace with your Supabase API key
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminDashboard = () => {
  const [nameFilter, setNameFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const [customerCodeFilter, setCustomerCodeFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPoints, setMinPoints] = useState('');
  const [maxPoints, setMaxPoints] = useState('');
  const [pointType, setPointType] = useState('total'); // total, claimed, unclaimed
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchFilteredUsers();
  }, [nameFilter, mobileFilter, customerCodeFilter, startDate, endDate, minPoints, maxPoints, pointType]);

  const fetchFilteredUsers = async () => {
    let { data: users, error } = await supabase
      .from('public.points')
      .select('*')
      .like('NAME', `%${nameFilter}%`)
      .like('MOBILE', `%${mobileFilter}%`)
      .eq('CUSTOMER CODE', customerCodeFilter);
  
    if (users && users.length > 0) {
      if (startDate && endDate) {
        users = users.filter(user => user['LAST SALES DATE'] >= startDate && user['LAST SALES DATE'] <= endDate);
      }
  
      if (minPoints && maxPoints) {
        users = users.filter(user => user[pointType.toUpperCase() + ' POINTS'] >= minPoints && user[pointType.toUpperCase() + ' POINTS'] <= maxPoints);
      }
  
      setFilteredUsers([...users]); // Update state with a new array to trigger re-render
    } else {
      setFilteredUsers([]); // Set an empty array if no users are found
    }
  };
  return (
    <div>
      {/* Filter inputs */}
      <input type="text" value={nameFilter} onChange={e => setNameFilter(e.target.value)} placeholder="Name" />
      <input type="text" value={mobileFilter} onChange={e => setMobileFilter(e.target.value)} placeholder="Mobile Number" />
      <input type="text" value={customerCodeFilter} onChange={e => setCustomerCodeFilter(e.target.value)} placeholder="Customer Code" />

      {/* Date pickers */}
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

      {/* Point range and type */}
      <input type="number" value={minPoints} onChange={e => setMinPoints(e.target.value)} placeholder="Min Points" />
      <input type="number" value={maxPoints} onChange={e => setMaxPoints(e.target.value)} placeholder="Max Points" />
      <select value={pointType} onChange={e => setPointType(e.target.value)}>
        <option value="total">Total Points</option>
        <option value="claimed">Claimed Points</option>
        <option value="unclaimed">Unclaimed Points</option>
      </select>

      {/* Display filtered users */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Customer Code</th>
            <th>Total Points</th>
            <th>Claimed Points</th>
            <th>Unclaimed Points</th>
            <th>Last Sales Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user['CUSTOMER CODE']}>
              <td>{user.NAME}</td>
              <td>{user.MOBILE}</td>
              <td>{user['CUSTOMER CODE']}</td>
              <td>{user['TOTAL POINTS']}</td>
              <td>{user['CLAIMED POINTS']}</td>
              <td>{user['UNCLAIMED POINTS']}</td>
              <td>{user['LAST SALES DATE']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;