import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Customers from './Customers';

const StyledTableContainer = styled.div`
  padding: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 8px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  margin-bottom: 20px;
  margin-right: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const StyledGoBackButton = styled.button`
  padding: 8px 16px;
  margin-bottom: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const Table = ({ pointsData, handleClaim }) => {
  const tableRef = useRef(null);
  const [showCustomers, setShowCustomers] = useState(false);

  const handleClaimClick = (point) => {
    const confirmClaim = window.confirm("Are you sure you want to claim this point?");
    if (confirmClaim) {
      handleClaim(point);
    }
  };

  const handleDownloadClick = () => {
    const doc = new jsPDF();
    const tableData = [...tableRef.current.rows].map(row =>
      [...row.cells].slice(0, -1).map(cell => cell.innerText)
    );
  
    doc.autoTable({
      head: [Array.from(tableRef.current.rows[0].cells).slice(0, -1).map(cell => cell.innerText)],
      body: tableData.slice(1),
    });
    doc.save('points_table.pdf');
  };

  const handleUploadDataClick = () => {
    setShowCustomers(true);
  };

  const handleGoBackClick = () => {
    setShowCustomers(false);
  };

  return (
    <StyledTableContainer>
      {showCustomers ? (
        <>
          <StyledGoBackButton onClick={handleGoBackClick}>Go Back</StyledGoBackButton>
          <Customers />
        </>
      ) : (
        <>
          <StyledButton onClick={handleDownloadClick}>Download as PDF</StyledButton>
          <StyledButton onClick={handleUploadDataClick}>Upload Data</StyledButton>

          <StyledTable ref={tableRef}>
            <thead>
              <tr>
                <th>CUSTOMER CODE</th>
                <th>ADDRESS1</th>
                <th>ADDRESS2</th>
                <th>ADDRESS3</th>
                <th>ADDRESS4</th>
                <th>MOBILE</th>
                <th>TOTAL</th>
                <th>CLAIMED</th>
                <th>UNCLAIMED</th>
                <th>LAST SALE</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pointsData.map((point) => (
                <tr key={point["CUSTOMER CODE"]}>
                  <td>{point["CUSTOMER CODE"]}</td>
                  <td>{point["ADDRESS1"]}</td>
                  <td>{point["ADDRESS2"]}</td>
                  <td>{point["ADDRESS3"]}</td>
                  <td>{point["ADDRESS4"]}</td>
                  <td>{point["MOBILE"]}</td>
                  <td>{point["TOTAL POINTS"]}</td>
                  <td>{point["CLAIMED POINTS"]}</td>
                  <td>{point["UNCLAIMED POINTS"]}</td>
                  <td>{point["LAST SALES DATE"]}</td>
                  <td>
                    {point["UNCLAIMED POINTS"] > 0 && (
                      <StyledButton onClick={() => handleClaimClick(point)}>Add Claim</StyledButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </>
      )}
    </StyledTableContainer>
  );
};

export default Table;
