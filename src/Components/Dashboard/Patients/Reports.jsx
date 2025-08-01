import React, { useState } from 'react';
import { 
  FaFileAlt, FaPrint, FaDownload, FaEye, 
  FaFilter, FaSearch, FaCalendarAlt, FaUserMd,
  FaTimes, FaChevronDown, FaChevronUp, FaFilePdf,
  FaFileMedical, FaXRay, FaDiagnoses, FaPrescriptionBottleAlt,
  FaProcedures, FaFileMedicalAlt, FaChartLine, FaFileInvoiceDollar
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';

// Custom CSS for animations and styling
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0.8; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  .animate-scaleIn {
    animation: scaleIn 0.5s ease-out;
  }
  .gradient-text {
    background: linear-gradient(to right, #3b82f6, #7c3aed);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .modal-backdrop {
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Reports = () => {
  const [activeTab, setActiveTab] = useState('lab');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [doctorFilter, setDoctorFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sample data for each report type
  const reportData = {
    lab: [
      { id: 1, name: 'Complete Blood Count', date: '2023-05-15', doctor: 'Dr. Smith', status: 'Completed', details: 'Results within normal ranges.' },
      { id: 2, name: 'Lipid Panel', date: '2023-06-02', doctor: 'Dr. Johnson', status: 'Pending', details: 'Awaiting results from lab.' },
      { id: 3, name: 'Thyroid Function Test', date: '2023-06-10', doctor: 'Dr. Lee', status: 'Completed', details: 'Mild hypothyroidism detected.' }
    ],
    imaging: [
      { id: 1, name: 'Chest X-Ray', date: '2023-05-18', doctor: 'Dr. Patel', status: 'Completed', details: 'No abnormalities detected.' },
      { id: 2, name: 'MRI Brain', date: '2023-06-05', doctor: 'Dr. Garcia', status: 'Completed', details: 'Small lesion detected, follow-up recommended.' }
    ],
    diagnosis: [
      { id: 1, name: 'Initial Diagnosis', date: '2023-05-10', doctor: 'Dr. Smith', status: 'Confirmed', details: 'Type 2 Diabetes Mellitus' },
      { id: 2, name: 'Follow-up Diagnosis', date: '2023-06-08', doctor: 'Dr. Smith', status: 'Confirmed', details: 'Hypertension' }
    ],
    prescriptions: [
      { id: 1, name: 'Metformin 500mg', date: '2023-05-10', doctor: 'Dr. Smith', status: 'Active', details: 'Take twice daily with meals.' },
      { id: 2, name: 'Lisinopril 10mg', date: '2023-06-08', doctor: 'Dr. Smith', status: 'Active', details: 'Take once daily in the morning.' }
    ],
    surgeries: [
      { id: 1, name: 'Appendectomy', date: '2023-04-22', doctor: 'Dr. Miller', status: 'Completed', details: 'Successful laparoscopic procedure.' }
    ],
    discharge: [
      { id: 1, name: 'Hospital Discharge Summary', date: '2023-04-25', doctor: 'Dr. Miller', status: 'Finalized', details: 'Patient recovered well post-surgery.' }
    ],
    progress: [
      { id: 1, name: 'Monthly Progress Report', date: '2023-06-01', doctor: 'Dr. Smith', status: 'Updated', details: 'Blood sugar levels improving with medication.' }
    ],
    billing: [
      { id: 1, name: 'Hospitalization Bill', date: '2023-04-30', doctor: 'Billing Dept', status: 'Paid', details: 'Total amount: $3,450.00' }
    ]
  };

  // Tab configuration with icons
  const tabs = [
    { id: 'lab', label: 'Lab Reports', icon: <FaFileMedical /> },
    { id: 'imaging', label: 'Imaging', icon: <FaXRay /> },
    { id: 'diagnosis', label: 'Diagnosis', icon: <FaDiagnoses /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FaPrescriptionBottleAlt /> },
    { id: 'surgeries', label: 'Surgeries', icon: <FaProcedures /> },
    { id: 'discharge', label: 'Discharge', icon: <FaFileMedicalAlt /> },
    { id: 'progress', label: 'Progress', icon: <FaChartLine /> },
    { id: 'billing', label: 'Billing', icon: <FaFileInvoiceDollar /> }
  ];

  // Filter reports based on search criteria
  const filteredReports = reportData[activeTab].filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         report.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = (!dateRange.start || report.date >= dateRange.start) && 
                       (!dateRange.end || report.date <= dateRange.end);
    const matchesDoctor = !doctorFilter || report.doctor === doctorFilter;
    
    return matchesSearch && matchesDate && matchesDoctor;
  });

  // Get unique doctors for filter dropdown
  const uniqueDoctors = [...new Set(reportData[activeTab].map(report => report.doctor))];

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleDownloadReport = (report) => {
    try {
      const doc = new jsPDF();
      doc.setProperties({
        title: `Report_${report.name.replace(/\s+/g, '_')}`,
        creator: 'Healthcare System'
      });
      doc.setFontSize(20);
      doc.text(report.name, 20, 20);
      doc.setFontSize(12);
      doc.text(`Date: ${report.date}`, 20, 30);
      doc.text(`Doctor: ${report.doctor}`, 20, 40);
      doc.text(`Status: ${report.status}`, 20, 50);
      doc.text('Details:', 20, 60);
      doc.text(report.details, 25, 70);
      doc.save(`${report.name.replace(/\s+/g, '_')}_Report.pdf`);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download report.');
    }
  };

  const handlePrintReport = (report) => {
    toast.info('Printing functionality would open the print dialog in a real app');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({ start: '', end: '' });
    setDoctorFilter('');
  };

  const ReportDetailModal = () => {
    if (!selectedReport) return null;
    
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 modal-backdrop">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl animate-scaleIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedReport.name}
            </h3>
            <button 
              onClick={() => setSelectedReport(null)}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
            >
              <FaTimes />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">{selectedReport.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="text-sm font-medium text-gray-900">{selectedReport.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`text-sm font-medium ${
                  selectedReport.status === 'Completed' || selectedReport.status === 'Confirmed' || selectedReport.status === 'Active' || selectedReport.status === 'Paid' 
                    ? 'text-green-600' 
                    : selectedReport.status === 'Pending' 
                      ? 'text-yellow-600' 
                      : 'text-blue-600'
                }`}>
                  {selectedReport.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {tabs.find(t => t.id === activeTab)?.label}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Details</p>
              <div className="mt-1 p-3 rounded-md bg-gray-100 text-gray-900">
                <p className="text-sm">{selectedReport.details}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 bg-gray-50 rounded-b-lg p-4 -m-6 mt-4">
              <button
                onClick={() => handleDownloadReport(selectedReport)}
                className="flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <FaDownload className="mr-2" /> Download
              </button>
              <button
                onClick={() => handlePrintReport(selectedReport)}
                className="flex items-center px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white transition-colors"
              >
                <FaPrint className="mr-2" /> Print
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 text-gray-900">
      <style>{styles}</style>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {selectedReport && <ReportDetailModal />}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 animate-scaleIn">
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaFileAlt className="text-3xl sm:text-4xl text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2">
              Medical Reports
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto no-scrollbar">
          <div className="flex space-x-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 animate-fadeIn">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <FaFilter />
                Filters
                {showFilters ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-300 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Date Range
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="text-gray-500" />
                        </div>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <span className="flex items-center text-gray-700">to</span>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="text-gray-500" />
                        </div>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Doctor
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUserMd className="text-gray-500" />
                      </div>
                      <select
                        value={doctorFilter}
                        onChange={(e) => setDoctorFilter(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      >
                        <option value="">All Doctors</option>
                        {uniqueDoctors.map(doctor => (
                          <option key={doctor} value={doctor}>{doctor}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Report Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{report.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{report.doctor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.status === 'Completed' || report.status === 'Confirmed' || report.status === 'Active' || report.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : report.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewReport(report)}
                            className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDownloadReport(report)}
                            className="p-1.5 rounded-md text-green-500 hover:bg-green-50 transition-colors"
                            title="Download"
                          >
                            <FaDownload />
                          </button>
                          <button
                            onClick={() => handlePrintReport(report)}
                            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
                            title="Print"
                          >
                            <FaPrint />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm">
                      No reports found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;