import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse'; // Import PapaParse for CSV parsing

const supabaseUrl = 'https://smfonqblavmkgmcylqoc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZm9ucWJsYXZta2dtY3lscW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMjI0MjQsImV4cCI6MjAyNzY5ODQyNH0.Yk9jlcLu2Svi8cAsQLuMJHflvBqbtusICyNj2ZfrVZg'; // Replace with your Supabase API key

const supabase = createClient(supabaseUrl, supabaseKey);

const Customers = () => {
  const [message, setMessage] = useState('');
  
  const handleFileUpload = async (event) => {
    try {
      const files = event.target.files;
      for (const file of files) {
        if (file) {
          await handleUploadedFile(file);
        }
      }
      setMessage('Files uploaded successfully');
    } catch (error) {
      console.error('Error uploading files:', error.message);
      setMessage('Failed to upload files. Please try again later.');
    }
  };

  const handleUploadedFile = async (file) => {
    const text = await file.text();
    const result = Papa.parse(text, { header: true });
    const rows = result.data;
    for (const row of rows) {
      await insertRow(row);
    }
  };

  const insertRow = async (row) => {
    try {
      await supabase.from('customers').insert(row);
    } catch (error) {
      console.error('Error inserting row:', error.message);
    }
  };

  return (
    <div className="container">
      <h1>Upload CSV Files</h1>
      <form action="/upload" method="post" encType="multipart/form-data">
        <input type="file" name="files[]" multiple onChange={handleFileUpload} />
        <input type="submit" value="Upload" />
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Customers;
