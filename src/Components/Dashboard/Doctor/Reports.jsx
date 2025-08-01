import { useState, useEffect } from 'react';
import {
  AiOutlineFilePdf,
  AiOutlineSearch,
  AiOutlineDownload,
  AiOutlineClose,
  AiOutlineUser
} from 'react-icons/ai';
import { MdVisibility, MdOutlineCloudUpload } from 'react-icons/md';
import { FaNotesMedical, FaFilter, FaCalendarAlt, FaFileMedical } from 'react-icons/fa';
import { BsCheckCircle, BsThreeDotsVertical } from 'react-icons/bs';

// Custom CSS for animations and text shadow
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
  .reports-header {
    position: relative;
    z-index: 10;
  }
  @media (max-width: 768px) {
    .reports-table th, .reports-table td {
      padding: 0.5rem;
      font-size: 0.875rem;
    }
    .reports-table th {
      display: none;
    }
    .reports-table tr {
      display: block;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .reports-table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f3f4f6;
    }
    .reports-table td:before {
      content: attr(data-label);
      font-weight: 600;
      color: #6b7280;
      margin-right: 1rem;
    }
    .reports-table td:last-child {
      border-bottom: none;
    }
  }
`;

const Reports = () => {
  // Dummy report data
  const dummyReports = [
    {
      id: 1,
      patientName: 'John Smith',
      patientId: 'P1001',
      age: 45,
      reportType: 'Lab',
      testName: 'Complete Blood Count',
      reportDate: '2023-05-15',
      status: 'New',
      results: 'Hemoglobin: 14.2 g/dL, WBC: 6.5 x10^9/L, Platelets: 250 x10^9/L',
      notes: '',
      fileUrl: '/sample-report.pdf'
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      patientId: 'P1002',
      age: 32,
      reportType: 'Imaging',
      testName: 'Chest X-Ray',
      reportDate: '2023-05-10',
      status: 'Reviewed',
      results: 'No active disease detected. Lungs are clear.',
      notes: 'Follow-up recommended in 6 months',
      fileUrl: '/sample-xray.pdf'
    },
    {
      id: 3,
      patientName: 'Michael Brown',
      patientId: 'P1003',
      age: 58,
      reportType: 'Lab',
      testName: 'Lipid Profile',
      reportDate: '2023-05-08',
      status: 'Pending',
      results: 'Cholesterol: 210 mg/dL, Triglycerides: 150 mg/dL, HDL: 45 mg/dL',
      notes: '',
      fileUrl: '/sample-lipid.pdf'
    },
    {
      id: 4,
      patientName: 'Emily Davis',
      patientId: 'P1004',
      age: 29,
      reportType: 'Pathology',
      testName: 'Biopsy Report',
      reportDate: '2023-05-05',
      status: 'Reviewed',
      results: 'Benign tissue with no signs of malignancy',
      notes: 'Patient informed. No further action required.',
      fileUrl: '/sample-biopsy.pdf'
    },
    {
      id: 5,
      patientName: 'Robert Wilson',
      patientId: 'P1005',
      age: 62,
      reportType: 'Lab',
      testName: 'Liver Function Test',
      reportDate: '2023-05-03',
      status: 'New',
      results: 'ALT: 35 U/L, AST: 28 U/L, Bilirubin: 0.8 mg/dL',
      notes: '',
      fileUrl: '/sample-liver.pdf'
    }
  ];

  // State management
  const [reports, setReports] = useState(dummyReports);
  const [filteredReports, setFilteredReports] = useState(dummyReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    reportType: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [newReport, setNewReport] = useState({
    patientId: '',
    reportType: '',
    testName: '',
    reportDate: new Date().toISOString().split('T')[0],
    notes: '',
    file: null
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter reports based on search and filters
  useEffect(() => {
    let results = reports;
    
    if (searchTerm) {
      results = results.filter(report => 
        report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.testName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.reportType) {
      results = results.filter(report => report.reportType === filters.reportType);
    }
    
    if (filters.status) {
      results = results.filter(report => report.status === filters.status);
    }
    
    if (filters.dateFrom) {
      results = results.filter(report => report.reportDate >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      results = results.filter(report => report.reportDate <= filters.dateTo);
    }
    
    setFilteredReports(results);
  }, [searchTerm, filters, reports]);

  // Handle viewing a report
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  // Handle marking report as reviewed
  const handleMarkAsReviewed = (reportId) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: 'Reviewed' } : report
    ));
    setSelectedReport({ ...selectedReport, status: 'Reviewed' });
  };

  // Handle adding notes to a report
  const handleAddNotes = (reportId, notes) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, notes } : report
    ));
    setSelectedReport({ ...selectedReport, notes });
  };

  // Handle file upload for new report
  const handleFileUpload = (e) => {
    setNewReport({ ...newReport, file: e.target.files[0] });
  };

  // Handle submitting new report
  const handleSubmitReport = () => {
    // In a real app, you would upload to server here
    const newReportEntry = {
      id: reports.length + 1,
      patientName: dummyReports.find(p => p.patientId === newReport.patientId)?.patientName || 'Unknown',
      patientId: newReport.patientId,
      age: dummyReports.find(p => p.patientId === newReport.patientId)?.age || 0,
      reportType: newReport.reportType,
      testName: newReport.testName,
      reportDate: newReport.reportDate,
      status: 'New',
      results: 'Pending results',
      notes: newReport.notes,
      fileUrl: URL.createObjectURL(newReport.file)
    };
    
    setReports([...reports, newReportEntry]);
    setShowUploadModal(false);
    setNewReport({
      patientId: '',
      reportType: '',
      testName: '',
      reportDate: new Date().toISOString().split('T')[0],
      notes: '',
      file: null
    });
  };

  // Get unique report types for filter dropdown
  const reportTypes = [...new Set(reports.map(report => report.reportType))];
  const statusTypes = ['New', 'Reviewed', 'Pending'];

  // Handle click outside to close modals
  const handleOutsideClick = (e, setModalState) => {
    if (e.target.classList.contains('modal-container')) {
      setModalState(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      reportType: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
    setShowFilters(false);
  };

  return (
    <div className="relative p-4 md:p-6 lg:p-8">
      <style>{styles}</style>
      
      {/* Header - Always visible above blur */}
      <div className={`reports-header ${(showReportModal || showUploadModal) ? 'relative z-50' : ''}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-3 animate-scaleIn">
            <div className="relative">
              <FaFileMedical className="text-3xl md:text-4xl text-blue-600" aria-hidden="true" />
              <AiOutlineFilePdf className="absolute -bottom-1 -right-1 text-lg md:text-xl bg-white rounded-full p-1 text-blue-600 border-2 border-blue-600" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center">
              Medical Reports
              <span className="ml-2 md:ml-3 text-xs md:text-sm font-normal bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full">
                {reports.length} total
              </span>
            </h2>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center bg-red-600 text-white px-4 py-2 md:px-5 md:py-3 rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all group w-full md:w-auto justify-center"
            aria-label="Upload new report"
          >
            <MdOutlineCloudUpload className="mr-2 transition-transform group-hover:rotate-90" />
            <span className="font-semibold">Upload Report</span>
          </button>
        </div>
      </div>

      {/* Main Content with Conditional Blur */}
      <div className={`transition-all duration-300 ${(showReportModal || showUploadModal) ? 'filter blur-sm opacity-90' : ''}`}>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <SummaryCard
            icon={<FaFileMedical className="text-xl md:text-2xl" />}
            title="Today's Reports"
            value={reports.filter(report => report.reportDate === new Date().toISOString().split('T')[0]).length}
            color="bg-blue-100 text-blue-600"
          />
          <SummaryCard
            icon={<BsCheckCircle className="text-xl md:text-2xl" />}
            title="Reviewed"
            value={reports.filter(report => report.status === 'Reviewed').length}
            color="bg-green-100 text-green-600"
          />
          <SummaryCard
            icon={<FaFilter className="text-xl md:text-2xl" />}
            title="Pending"
            value={reports.filter(report => report.status === 'Pending').length}
            color="bg-yellow-100 text-yellow-600"
          />
          <SummaryCard
            icon={<AiOutlineFilePdf className="text-xl md:text-2xl" />}
            title="New"
            value={reports.filter(report => report.status === 'New').length}
            color="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <div className="relative w-full md:flex-1 md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AiOutlineSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by patient or test name..."
              className="pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search reports"
            />
          </div>
          <div className="flex gap-2 md:gap-4 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all group w-full md:w-auto justify-center"
              aria-label="Open filter options"
            >
              <FaFilter className="mr-2 transition-transform group-hover:rotate-180" />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.reportType}
                  onChange={(e) => setFilters({...filters, reportType: e.target.value})}
                >
                  <option value="">All Types</option>
                  {reportTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">All Statuses</option>
                  {statusTypes.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 reports-table">
              <thead className="bg-gray-50 hidden md:table-header-group">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <AiOutlineUser className="mr-1" />
                      Patient
                    </div>
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaFileMedical className="mr-1" />
                      Report Type
                    </div>
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <FaNotesMedical className="inline mr-1" />
                    Test Name
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      Report Date
                    </div>
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <BsCheckCircle className="mr-1" />
                      Status
                    </div>
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <tr key={report.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap" data-label="Patient">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                            <AiOutlineUser className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <div className="ml-2 md:ml-4">
                            <div className="font-semibold text-gray-900 text-sm md:text-base">{report.patientName}</div>
                            <div className="text-xs md:text-sm text-gray-600">ID: {report.patientId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600" data-label="Report Type">
                        <FaFileMedical className="inline mr-1 text-gray-400" />
                        {report.reportType}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" data-label="Test Name">
                        {report.testName}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600" data-label="Report Date">
                        <FaCalendarAlt className="inline mr-1 text-gray-400" />
                        {report.reportDate}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap" data-label="Status">
                        <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                          report.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          report.status === 'Reviewed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status === 'Reviewed' ? (
                            <BsCheckCircle className="inline mr-1" />
                          ) : report.status === 'Pending' ? (
                            <FaFilter className="inline mr-1" />
                          ) : (
                            <AiOutlineFilePdf className="inline mr-1" />
                          )}
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium" data-label="Actions">
                        <div className="flex gap-1 md:gap-2">
                          <button
                            onClick={() => handleViewReport(report)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="View Report"
                          >
                            <MdVisibility size={16} />
                          </button>
                          <a
                            href={report.fileUrl}
                            download
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Download Report"
                          >
                            <AiOutlineDownload size={16} />
                          </a>
                          <button
                            onClick={() => {
                              setSelectedReport(report);
                              setShowReportModal(true);
                            }}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                            title="Add Notes"
                          >
                            <FaNotesMedical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No reports found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div
          className="modal-container fixed inset-0 flex items-center justify-center z-50 pt-16 modal-backdrop"
          onClick={(e) => handleOutsideClick(e, setShowReportModal)}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto p-4 md:p-6 lg:p-8 animate-fadeIn">
            <div className="flex justify-between items-start">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                <AiOutlineFilePdf className="mr-2 text-red-600" />
                {selectedReport.testName} Report
              </h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close report details"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <AiOutlineUser className="mr-2 text-blue-600" />
                  Patient Information
                </h3>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Name</p>
                      <p className="font-medium text-sm md:text-base">{selectedReport.patientName}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Patient ID</p>
                      <p className="font-medium text-sm md:text-base">{selectedReport.patientId}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Age</p>
                      <p className="font-medium text-sm md:text-base">{selectedReport.age}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Report Date</p>
                      <p className="font-medium text-sm md:text-base">{selectedReport.reportDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <FaFileMedical className="mr-2 text-blue-600" />
                  Report Details
                </h3>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Report Type</p>
                      <p className="font-medium text-sm md:text-base">{selectedReport.reportType}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Test Name</p>
                      <p className="font-medium text-sm md:text-base">{selectedReport.testName}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Status</p>
                      <p className="font-medium text-sm md:text-base">
                        <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                          selectedReport.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          selectedReport.status === 'Reviewed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedReport.status === 'Reviewed' ? (
                            <BsCheckCircle className="inline mr-1" />
                          ) : selectedReport.status === 'Pending' ? (
                            <FaFilter className="inline mr-1" />
                          ) : (
                            <AiOutlineFilePdf className="inline mr-1" />
                          )}
                          {selectedReport.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaNotesMedical className="mr-2 text-blue-600" />
                Test Results
              </h3>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <p className="whitespace-pre-line text-sm md:text-base">{selectedReport.results}</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <AiOutlineFilePdf className="mr-2 text-red-600" />
                Report Preview
              </h3>
              <div className="border border-gray-200 rounded-lg p-3 md:p-4 flex justify-center items-center h-48 md:h-64 bg-gray-100">
                <AiOutlineFilePdf size={32} className="text-red-500" />
                <span className="ml-2 text-gray-700 text-sm md:text-base">{selectedReport.testName}.pdf</span>
              </div>
              <div className="mt-2 flex justify-end">
                <a
                  href={selectedReport.fileUrl}
                  download
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm md:text-base"
                >
                  <AiOutlineDownload className="mr-1" /> Download Full Report
                </a>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaNotesMedical className="mr-2 text-blue-600" />
                Doctor's Notes
              </h3>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                rows="3"
                placeholder="Add your notes here..."
                value={selectedReport.notes}
                onChange={(e) => handleAddNotes(selectedReport.id, e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between gap-3 mt-4 md:mt-6">
              <button
                onClick={() => handleMarkAsReviewed(selectedReport.id)}
                disabled={selectedReport.status === 'Reviewed'}
                className={`flex items-center justify-center px-3 py-2 md:px-4 md:py-2 rounded-lg ${
                  selectedReport.status === 'Reviewed' 
                    ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <BsCheckCircle className="mr-2" />
                {selectedReport.status === 'Reviewed' ? 'Already Reviewed' : 'Mark as Reviewed'}
              </button>
              
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3 py-2 md:px-4 md:py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Report Modal */}
      {showUploadModal && (
        <div
          className="modal-container fixed inset-0 flex items-center justify-center z-50 pt-16 modal-backdrop"
          onClick={(e) => handleOutsideClick(e, setShowUploadModal)}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 animate-fadeIn">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="flex justify-between items-start">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                  <MdOutlineCloudUpload className="mr-2 text-blue-600" />
                  Upload New Report
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Close upload modal"
                >
                  &times;
                </button>
              </div>
              
              <div className="space-y-3 md:space-y-4 mt-4 md:mt-6">
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-900 mb-1 flex items-center">
                    <AiOutlineUser className="mr-2" />
                    Select Patient
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    value={newReport.patientId}
                    onChange={(e) => setNewReport({ ...newReport, patientId: e.target.value })}
                  >
                    <option value="">Select a patient</option>
                    {dummyReports.map(report => (
                      <option key={report.patientId} value={report.patientId}>
                        {report.patientName} (ID: {report.patientId})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm md:text-base font-semibold text-gray-900 mb-1 flex items-center">
                      <FaFileMedical className="mr-2" />
                      Report Type
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      value={newReport.reportType}
                      onChange={(e) => setNewReport({ ...newReport, reportType: e.target.value })}
                    >
                      <option value="">Select report type</option>
                      {reportTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm md:text-base font-semibold text-gray-900 mb-1 flex items-center">
                      <FaNotesMedical className="mr-2" />
                      Test Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      placeholder="Enter test name"
                      value={newReport.testName}
                      onChange={(e) => setNewReport({ ...newReport, testName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-900 mb-1 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Report Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    value={newReport.reportDate}
                    onChange={(e) => setNewReport({ ...newReport, reportDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-900 mb-1 flex items-center">
                    <AiOutlineFilePdf className="mr-2" />
                    Report File (PDF/Image)
                  </label>
                  <div className="mt-1 flex justify-center px-4 pt-4 pb-5 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {newReport.file ? (
                        <div className="flex items-center justify-center">
                          <AiOutlineFilePdf size={20} className="text-red-500" />
                          <span className="ml-2 text-sm text-gray-600">{newReport.file.name}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm md:text-base font-semibold text-gray-900 mb-1 flex items-center">
                    <FaNotesMedical className="mr-2" />
                    Notes (Optional)
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    rows="2"
                    placeholder="Add any notes about this report..."
                    value={newReport.notes}
                    onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
                  ></textarea>
                </div>
                
                <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-3 pt-3 md:pt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-3 py-2 md:px-4 md:py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReport}
                    disabled={!newReport.patientId || !newReport.reportType || !newReport.testName || !newReport.file}
                    className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-white text-sm md:text-base ${
                      !newReport.patientId || !newReport.reportType || !newReport.testName || !newReport.file
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Save Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ icon, title, value, color }) => (
  <div className={`flex items-center p-4 md:p-6 rounded-xl shadow-md ${color} border border-gray-200 transition-transform hover:scale-105`}>
    <div className="p-2 md:p-3 rounded-full bg-white bg-opacity-50 mr-3 md:mr-4">
      {icon}
    </div>
    <div>
      <p className="text-xs md:text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-xl md:text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Reports;