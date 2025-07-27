import React, { useState, useEffect, useRef } from 'react';
import Nav from '../Nav/Nav';
import './ReportedItems.css';
import axios from 'axios';
import FlaggedItems from '../FlaggedItems/FlaggedItems';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const URL = 'http://localhost:5000/reports';

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function ReportedItems() {
  const [reports, setReports] = useState([]);
  const pdfRef = useRef();

  useEffect(() => {
    fetchHandler()
      .then((data) => setReports(data.reports || data))
      .catch((error) => console.error('Error fetching reports:', error));
  }, []);

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PDF', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('invoice.pdf');
    });
  };

  return (
    <div className="RI-reported-items-page">
      <header className="RI-header-banner">
        <Nav />
        <div className="RI-header-overlay">
          <br/>
          <br/>
          <br/>
          <h1 className="RI-page-title">Reports Dashboard</h1>
        </div>
      </header>
      <main className="RI-content-wrapper">
        {reports.length > 0 ? (
          <div ref={pdfRef}>
            <table className="RI-reports-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Report Name</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, i) => (
                  <FlaggedItems key={i} report={report} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="RI-no-reports">No flagged items found at this time.</p>
        )}
        <button className="RI-download-button" onClick={downloadPDF}>Download PDF</button>
      </main>
    </div>
  );
}

export default ReportedItems;