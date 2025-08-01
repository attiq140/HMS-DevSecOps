import React, { createContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiPrinter, FiPlus, FiEdit, FiX, FiTrash } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';

// Custom CSS
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0.8; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  .animate-scaleIn { animation: scaleIn 0.5s ease-out; }
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
  @media (max-width: 640px) {
    .responsive-grid { grid-template-columns: 1fr; }
    .responsive-text-sm { font-size: 0.875rem; }
    .responsive-p-2 { padding: 0.5rem; }
  }
  .records-modal { max-width: 600px; width: 90%; }
  .toast-container { font-size: 0.875rem; }
  .records-table {
    table-layout: fixed;
    width: 100%;
    min-width: 0;
  }
  .records-table th, .records-table td {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
  }
  @media (max-width: 768px) {
    .records-table th, .records-table td {
      font-size: 0.75rem;
      padding: 0.5rem;
    }
  }
  @media (max-width: 640px) {
    .records-table th, .records-table td {
      font-size: 0.7rem;
      padding: 0.4rem;
    }
  }
`;

// Context for role-based access
const RoleContext = createContext();

const MedicalRecords = ({ role = 'patient' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  // State for all data sections
  const [patientData, setPatientData] = useState({
    name: 'John Doe',
    id: 'PAT-001',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+',
    lastVisit: '2025-06-15',
  });

  const [prescriptions, setPrescriptions] = useState([
    { id: 1, name: 'Amoxicillin', dosage: '500mg', duration: '7 days', doctor: 'Dr. Smith' },
    { id: 2, name: 'Ibuprofen', dosage: '200mg', duration: '5 days', doctor: 'Dr. Jones' },
  ]);

  const [labReports, setLabReports] = useState([
    { id: 1, testName: 'CBC', date: '2025-06-10', result: 'Normal', notes: 'No abnormalities' },
    { id: 2, testName: 'Lipid Panel', date: '2025-06-12', result: 'Elevated', notes: 'Follow-up required' },
  ]);

  const [visitHistory, setVisitHistory] = useState([
    { id: 1, date: '2025-06-15', department: 'Cardiology', doctor: 'Dr. Smith', diagnosis: 'Hypertension', symptoms: 'Headache, dizziness' },
  ]);

  const [doctorNotes, setDoctorNotes] = useState([
    { id: 1, date: '2025-06-15', subjective: 'Patient reports headaches', objective: 'BP 140/90', assessment: 'Hypertension', plan: 'Start medication' },
  ]);

  const [attachments, setAttachments] = useState([
    { id: 1, name: 'X-Ray_2025-06-10.pdf', type: 'PDF', date: '2025-06-10' },
  ]);

  const tabs = ['overview', 'prescriptions', 'labReports', 'visitHistory', 'doctorNotes', 'attachments'];

  // Input validations for each section
  const validateForm = (data, type) => {
    const newErrors = {};
    switch (type) {
      case 'patient':
        if (!data.name?.trim()) newErrors.name = 'Patient name is required';
        if (!data.id?.trim()) newErrors.id = 'Patient ID is required';
        if (!data.age) newErrors.age = 'Age is required';
        if (!data.gender?.trim()) newErrors.gender = 'Gender is required';
        break;
      case 'prescription':
        if (!data.name?.trim()) newErrors.name = 'Medication name is required';
        if (!data.dosage?.trim()) newErrors.dosage = 'Dosage is required';
        if (!data.duration?.trim()) newErrors.duration = 'Duration is required';
        if (!data.doctor?.trim()) newErrors.doctor = 'Doctor name is required';
        break;
      case 'labReport':
        if (!data.testName?.trim()) newErrors.testName = 'Test name is required';
        if (!data.date?.trim()) newErrors.date = 'Date is required';
        if (!data.result?.trim()) newErrors.result = 'Result is required';
        break;
      case 'visitHistory':
        if (!data.date?.trim()) newErrors.date = 'Date is required';
        if (!data.department?.trim()) newErrors.department = 'Department is required';
        if (!data.doctor?.trim()) newErrors.doctor = 'Doctor name is required';
        break;
      case 'doctorNote':
        if (!data.date?.trim()) newErrors.date = 'Date is required';
        if (!data.subjective?.trim()) newErrors.subjective = 'Subjective is required';
        if (!data.objective?.trim()) newErrors.objective = 'Objective is required';
        break;
      case 'attachment':
        if (!data.name?.trim()) newErrors.name = 'File name is required';
        if (!data.type?.trim()) newErrors.type = 'File type is required';
        if (!data.date?.trim()) newErrors.date = 'Date is required';
        break;
      default:
        break;
    }
    return newErrors;
  };

  // Handle add/edit data
  const handleSave = (data, type) => {
    if (role !== 'doctor') return;

    const validationErrors = validateForm(data, type);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    switch (type) {
      case 'patient':
        setPatientData(data);
        toast.success('Patient data updated successfully!');
        break;
      case 'prescription':
        if (isEditMode) {
          setPrescriptions(prescriptions.map((p) => (p.id === editId ? { ...p, ...data } : p)));
          toast.success('Prescription updated successfully!');
        } else {
          setPrescriptions([...prescriptions, { id: prescriptions.length + 1, ...data }]);
          toast.success('Prescription added successfully!');
        }
        break;
      case 'labReport':
        if (isEditMode) {
          setLabReports(labReports.map((r) => (r.id === editId ? { ...r, ...data } : r)));
          toast.success('Lab report updated successfully!');
        } else {
          setLabReports([...labReports, { id: labReports.length + 1, ...data }]);
          toast.success('Lab report added successfully!');
        }
        break;
      case 'visitHistory':
        if (isEditMode) {
          setVisitHistory(visitHistory.map((v) => (v.id === editId ? { ...v, ...data } : v)));
          toast.success('Visit history updated successfully!');
        } else {
          setVisitHistory([...visitHistory, { id: visitHistory.length + 1, ...data }]);
          toast.success('Visit history added successfully!');
        }
        break;
      case 'doctorNote':
        if (isEditMode) {
          setDoctorNotes(doctorNotes.map((n) => (n.id === editId ? { ...n, ...data } : n)));
          toast.success('Doctor note updated successfully!');
        } else {
          setDoctorNotes([...doctorNotes, { id: doctorNotes.length + 1, ...data }]);
          toast.success('Doctor note added successfully!');
        }
        break;
      case 'attachment':
        if (isEditMode) {
          setAttachments(attachments.map((a) => (a.id === editId ? { ...a, ...data } : a)));
          toast.success('Attachment updated successfully!');
        } else {
          setAttachments([...attachments, { id: attachments.length + 1, ...data }]);
          toast.success('Attachment added successfully!');
        }
        break;
      default:
        break;
    }

    setIsModalOpen(false);
    setModalType(null);
    setIsEditMode(false);
    setEditId(null);
    setErrors({});
  };

  // Handle delete data
  const handleDelete = (id, type) => {
    if (role !== 'doctor') return;

    switch (type) {
      case 'prescription':
        setPrescriptions(prescriptions.filter((p) => p.id !== id));
        toast.success('Prescription deleted successfully!');
        break;
      case 'labReport':
        setLabReports(labReports.filter((r) => r.id !== id));
        toast.success('Lab report deleted successfully!');
        break;
      case 'visitHistory':
        setVisitHistory(visitHistory.filter((v) => v.id !== id));
        toast.success('Visit history deleted successfully!');
        break;
      case 'doctorNote':
        setDoctorNotes(doctorNotes.filter((n) => n.id !== id));
        toast.success('Doctor note deleted successfully!');
        break;
      case 'attachment':
        setAttachments(attachments.filter((a) => a.id !== id));
        toast.success('Attachment deleted successfully!');
        break;
      default:
        break;
    }
  };

  // Handle download
  const handleDownload = (item, type) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${type.replace(/([A-Z])/g, ' $1').trim().toUpperCase()} - ${item.name || item.testName}`, 20, 20);

    Object.keys(item).forEach((key, index) => {
      if (key !== 'id') {
        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${item[key]}`, 20, 30 + index * 10);
      }
    });

    doc.save(`${type}_${item.id}.pdf`);
    toast.success('File downloaded successfully!');
  };

  // Generate dynamic PDF summary
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Medical Records Summary', 20, 20);
    doc.setFontSize(12);

    // Patient Info
    doc.text('Patient Information', 20, 30);
    Object.keys(patientData).forEach((key, index) => {
      doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${patientData[key]}`, 20, 40 + index * 10);
    });

    // Prescriptions
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Prescriptions', 20, 20);
    prescriptions.forEach((p, index) => {
      doc.text(`${p.name} - ${p.dosage} (${p.duration}) by ${p.doctor}`, 20, 30 + index * 10);
    });

    // Lab Reports
    doc.addPage();
    doc.text('Lab Reports', 20, 20);
    labReports.forEach((r, index) => {
      doc.text(`${r.testName} - ${r.result} (${r.date})`, 20, 30 + index * 10);
    });

    // Visit History
    doc.addPage();
    doc.text('Visit History', 20, 20);
    visitHistory.forEach((v, index) => {
      doc.text(`${v.date} - ${v.department} (${v.diagnosis})`, 20, 30 + index * 10);
    });

    // Doctor Notes
    doc.addPage();
    doc.text('Doctor Notes', 20, 20);
    doctorNotes.forEach((n, index) => {
      doc.text(`${n.date} - ${n.assessment}`, 20, 30 + index * 10);
    });

    // Attachments
    doc.addPage();
    doc.text('Attachments', 20, 20);
    attachments.forEach((a, index) => {
      doc.text(`${a.name} - ${a.type} (${a.date})`, 20, 30 + index * 10);
    });

    doc.save(`Medical_Records_${patientData.id}.pdf`);
    toast.success('Summary downloaded successfully!');
  };

  const TabContent = ({ title, tab }) => {
    switch (tab) {
      case 'overview':
        return (
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <FaUserMd className="mr-2 text-blue-600" /> {title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 responsive-grid">
              {Object.entries(patientData).map(([key, value]) => (
                <p key={key} className="text-sm">
                  <strong className="text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  <span className="text-gray-600"> {value}</span>
                </p>
              ))}
            </div>
            <button
              onClick={generatePDF}
              className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
            >
              <FiPrinter className="mr-2" /> Download Summary
            </button>
            {role === 'doctor' && (
              <button
                onClick={() => {
                  setModalType('patient');
                  setIsModalOpen(true);
                  setIsEditMode(true);
                }}
                className="mt-4 ml-2 flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm sm:text-base"
              >
                <FiEdit className="mr-2" /> Edit Patient
              </button>
            )}
          </div>
        );
      case 'prescriptions':
        return (
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                <FaUserMd className="mr-2 text-blue-600" /> {title}
              </h3>
              {role === 'doctor' && (
                <button
                  onClick={() => {
                    setModalType('prescription');
                    setIsModalOpen(true);
                    setIsEditMode(false);
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm sm:text-base"
                >
                  <FiPlus className="mr-2" /> Add Prescription
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 records-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Dosage</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                    {role === 'doctor' && <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prescriptions.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.name}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.dosage}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.duration}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.doctor}</td>
                      {role === 'doctor' && (
                        <td className="px-4 sm:px-6 py-3 sm:py-4 flex space-x-2">
                          <button
                            onClick={() => {
                              setModalType('prescription');
                              setIsModalOpen(true);
                              setIsEditMode(true);
                              setEditId(item.id);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, 'prescription')}
                            className="text-red-600 hover:text-red-800 text-sm flex items-center"
                          >
                            <FiTrash className="mr-1" /> Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'labReports':
        return (
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                <FaUserMd className="mr-2 text-blue-600" /> {title}
              </h3>
              {role === 'doctor' && (
                <button
                  onClick={() => {
                    setModalType('labReport');
                    setIsModalOpen(true);
                    setIsEditMode(false);
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm sm:text-base"
                >
                  <FiPlus className="mr-2" /> Add Lab Report
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 records-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Test Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Result</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {labReports.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.testName}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.date}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.result}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.notes}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 flex space-x-2">
                        <button
                          onClick={() => handleDownload(item, 'labReport')}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <FiDownload className="mr-1" /> Download
                        </button>
                        {role === 'doctor' && (
                          <>
                            <button
                              onClick={() => {
                                setModalType('labReport');
                                setIsModalOpen(true);
                                setIsEditMode(true);
                                setEditId(item.id);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                              <FiEdit className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, 'labReport')}
                              className="text-red-600 hover:text-red-800 text-sm flex items-center"
                            >
                              <FiTrash className="mr-1" /> Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'visitHistory':
        return (
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                <FaUserMd className="mr-2 text-blue-600" /> {title}
              </h3>
              {role === 'doctor' && (
                <button
                  onClick={() => {
                    setModalType('visitHistory');
                    setIsModalOpen(true);
                    setIsEditMode(false);
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm sm:text-base"
                >
                  <FiPlus className="mr-2" /> Add Visit
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 records-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Diagnosis</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Symptoms</th>
                    {role === 'doctor' && <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visitHistory.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.date}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.doctor}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.diagnosis}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.symptoms}</td>
                      {role === 'doctor' && (
                        <td className="px-4 sm:px-6 py-3 sm:py-4 flex space-x-2">
                          <button
                            onClick={() => {
                              setModalType('visitHistory');
                              setIsModalOpen(true);
                              setIsEditMode(true);
                              setEditId(item.id);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, 'visitHistory')}
                            className="text-red-600 hover:text-red-800 text-sm flex items-center"
                          >
                            <FiTrash className="mr-1" /> Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'doctorNotes':
        return (
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                <FaUserMd className="mr-2 text-blue-600" /> {title} (SOAP)
              </h3>
              {role === 'doctor' && (
                <button
                  onClick={() => {
                    setModalType('doctorNote');
                    setIsModalOpen(true);
                    setIsEditMode(false);
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm sm:text-base"
                >
                  <FiPlus className="mr-2" /> Add Note
                </button>
              )}
            </div>
            {doctorNotes.map((note) => (
              <div key={note.id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all">
                {Object.entries(note).map(([key, value]) => (
                  key !== 'id' && (
                    <p key={key} className="text-sm">
                      <strong className="text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                      <span className="text-gray-600"> {value}</span>
                    </p>
                  )
                ))}
                {role === 'doctor' && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => {
                        setModalType('doctorNote');
                        setIsModalOpen(true);
                        setIsEditMode(true);
                        setEditId(note.id);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <FiEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id, 'doctorNote')}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <FiTrash className="mr-1" /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'attachments':
        return (
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                <FaUserMd className="mr-2 text-blue-600" /> {title}
              </h3>
              {role === 'doctor' && (
                <button
                  onClick={() => {
                    setModalType('attachment');
                    setIsModalOpen(true);
                    setIsEditMode(false);
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm sm:text-base"
                >
                  <FiPlus className="mr-2" /> Add Attachment
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 records-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attachments.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.name}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.type}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{item.date}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 flex space-x-2">
                        <button
                          onClick={() => handleDownload(item, 'attachment')}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <FiDownload className="mr-1" /> Download
                        </button>
                        {role === 'doctor' && (
                          <>
                            <button
                              onClick={() => {
                                setModalType('attachment');
                                setIsModalOpen(true);
                                setIsEditMode(true);
                                setEditId(item.id);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                              <FiEdit className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, 'attachment')}
                              className="text-red-600 hover:text-red-800 text-sm flex items-center"
                            >
                              <FiTrash className="mr-1" /> Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Modal content based on type
  const renderModalContent = () => {
    let initialData = {};
    if (isEditMode) {
      switch (modalType) {
        case 'patient':
          initialData = patientData;
          break;
        case 'prescription':
          initialData = prescriptions.find((p) => p.id === editId) || {};
          break;
        case 'labReport':
          initialData = labReports.find((r) => r.id === editId) || {};
          break;
        case 'visitHistory':
          initialData = visitHistory.find((v) => v.id === editId) || {};
          break;
        case 'doctorNote':
          initialData = doctorNotes.find((n) => n.id === editId) || {};
          break;
        case 'attachment':
          initialData = attachments.find((a) => a.id === editId) || {};
          break;
        default:
          break;
      }
    }

    const [formData, setFormData] = useState(initialData);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const fields = {
      patient: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'id', label: 'Patient ID', type: 'text' },
        { name: 'age', label: 'Age', type: 'number' },
        { name: 'gender', label: 'Gender', type: 'text' },
        { name: 'bloodGroup', label: 'Blood Group', type: 'text' },
        { name: 'lastVisit', label: 'Last Visit', type: 'date' },
      ],
      prescription: [
        { name: 'name', label: 'Medication Name', type: 'text' },
        { name: 'dosage', label: 'Dosage', type: 'text' },
        { name: 'duration', label: 'Duration', type: 'text' },
        { name: 'doctor', label: 'Doctor Name', type: 'text' },
      ],
      labReport: [
        { name: 'testName', label: 'Test Name', type: 'text' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'result', label: 'Result', type: 'text' },
        { name: 'notes', label: 'Notes', type: 'text' },
      ],
      visitHistory: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'department', label: 'Department', type: 'text' },
        { name: 'doctor', label: 'Doctor Name', type: 'text' },
        { name: 'diagnosis', label: 'Diagnosis', type: 'text' },
        { name: 'symptoms', label: 'Symptoms', type: 'text' },
      ],
      doctorNote: [
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'subjective', label: 'Subjective', type: 'textarea' },
        { name: 'objective', label: 'Objective', type: 'textarea' },
        { name: 'assessment', label: 'Assessment', type: 'textarea' },
        { name: 'plan', label: 'Plan', type: 'textarea' },
      ],
      attachment: [
        { name: 'name', label: 'File Name', type: 'text' },
        { name: 'type', label: 'File Type', type: 'text' },
        { name: 'date', label: 'Date', type: 'date' },
      ],
    };

    return (
      <div className="space-y-4">
        {fields[modalType]?.map((field) => (
          <div key={field.name}>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                placeholder={field.label}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={errors[field.name] ? 'true' : 'false'}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.label}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={errors[field.name] ? 'true' : 'false'}
              />
            )}
            {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
          </div>
        ))}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setIsModalOpen(false);
              setModalType(null);
              setIsEditMode(false);
              setEditId(null);
              setErrors({});
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave(formData, modalType)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
          >
            {isEditMode ? `Update ${modalType.replace(/([A-Z])/g, ' $1').trim()}` : `Add ${modalType.replace(/([A-Z])/g, ' $1').trim()}`}
          </button>
        </div>
      </div>
    );
  };

  return (
    <RoleContext.Provider value={role}>
      <div className="relative p-4 sm:p-6 md:p-8">
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
          className="toast-container"
        />

        {/* Modal for adding/editing */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
            <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 records-modal animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {isEditMode ? `Edit ${modalType.replace(/([A-Z])/g, ' $1').trim()}` : `Add ${modalType.replace(/([A-Z])/g, ' $1').trim()}`}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setIsEditMode(false);
                    setEditId(null);
                    setErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              {renderModalContent()}
            </div>
          </div>
        )}

        {/* Header with dynamic patient name */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 animate-scaleIn">
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaUserMd className="text-3xl sm:text-4xl text-blue-600" aria-hidden="true" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center">
              Medical Records
              <span className="ml-2 text-xs sm:text-sm font-normal bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full">
                {patientData.name}
              </span>
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
          {/* Patient Info Section */}
          <div className="p-4 sm:p-6 md:p-8 bg-blue-50">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <FaUserMd className="mr-2 text-blue-600" /> Patient Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 responsive-grid">
              {Object.entries(patientData).map(([key, value]) => (
                <p key={key} className="text-sm">
                  <strong className="text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  <span className="text-gray-600"> {value}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-200 p-4 sm:p-6">
            <ul className="flex flex-wrap gap-2 sm:gap-3 overflow-x-auto">
              {tabs.map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-sm font-semibold capitalize rounded-md transition-all ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tab Content */}
          <AnimatePresence>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6"
            >
              <TabContent title={activeTab.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())} tab={activeTab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </RoleContext.Provider>
  );
};

export default MedicalRecords;