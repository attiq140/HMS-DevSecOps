import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaSearch, FaFilter, FaEye, FaNotesMedical, 
  FaPills, FaHistory, FaFilePdf, FaPrint, FaPlus, 
  FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaTint, FaIdCard, FaVenusMars, FaBirthdayCake, FaTimes, FaCheck,
  FaFileUpload, FaFileDownload, FaTrash
} from 'react-icons/fa';
import { AiOutlineHistory } from 'react-icons/ai';
import { MdMedicalServices, MdOutlineMedicalInformation } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  .patient-header {
    position: relative;
    z-index: 10;
  }
  .file-upload {
    display: none;
  }
  .file-item {
    transition: all 0.3s ease;
  }
  .file-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  @media (max-width: 768px) {
    .patient-table-header {
      display: none;
    }
    .patient-table-row {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .patient-table-cell {
      padding: 0.5rem 0;
      display: flex;
      justify-content: space-between;
    }
    .patient-table-cell:before {
      content: attr(data-label);
      font-weight: 600;
      margin-right: 1rem;
      color: #4b5563;
    }
    .patient-actions {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 0.5rem;
    }
    .patient-actions button {
      margin: 0 0.25rem;
    }
    .patient-detail-modal {
      width: 95%;
      margin: 0 auto;
      padding: 0.5rem;
    }
    .filter-modal {
      width: 90%;
      margin: 0 auto;
    }
    .prescription-grid {
      grid-template-columns: 1fr;
    }
    .file-upload-section {
      flex-direction: column;
      align-items: stretch;
    }
    .file-upload-section button {
      margin-top: 0.5rem;
    }
  }
`;

// Initial mock patient data
const initialPatients = [
  {
    id: 'P1001',
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    age: 35,
    gender: 'Male',
    contact: {
      phone: '+1 555-123-4567',
      email: 'john.smith@example.com'
    },
    lastVisit: '2023-05-15',
    diagnosis: 'Type 2 Diabetes',
    tags: ['Diabetic', 'Hypertension'],
    details: {
      cnic: '12345-6789012-3',
      address: '123 Main St, New York, NY 10001',
      bloodGroup: 'A+',
      conditions: ['Type 2 Diabetes', 'Hypertension'],
      allergies: ['Penicillin'],
      medications: ['Metformin 500mg', 'Lisinopril 10mg']
    },
    history: [
      {
        id: uuidv4(),
        date: '2023-05-15',
        diagnosis: 'Diabetes Follow-up',
        notes: 'Patient reports improved glucose levels. Continue current medication.',
        prescription: [
          { id: uuidv4(), medicine: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }
        ],
        files: []
      },
      {
        id: uuidv4(),
        date: '2023-03-10',
        diagnosis: 'Hypertension Check',
        notes: 'Blood pressure under control. Adjusting Lisinopril dosage.',
        prescription: [
          { id: uuidv4(), medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }
        ],
        files: []
      }
    ],
    notes: [
      {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        type: 'follow-up',
        content: 'Patient needs follow-up in 2 weeks to check glucose levels.',
        doctor: 'Dr. Sarah Johnson'
      },
      {
        id: uuidv4(),
        date: '2023-05-10',
        type: 'critical',
        content: 'Patient has severe allergy to Penicillin. Must avoid all penicillin-derived antibiotics.',
        doctor: 'Dr. Sarah Johnson'
      }
    ],
    files: []
  },
  {
    id: 'P1002',
    name: 'Emma Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    age: 28,
    gender: 'Female',
    contact: {
      phone: '+1 555-234-5678',
      email: 'emma.wilson@example.com'
    },
    lastVisit: '2023-06-10',
    diagnosis: 'Migraine',
    tags: ['Chronic Migraine'],
    details: {
      cnic: '23456-7890123-4',
      address: '456 Oak Ave, Boston, MA 02115',
      bloodGroup: 'B-',
      conditions: ['Chronic Migraine'],
      allergies: ['Sulfa drugs'],
      medications: ['Sumatriptan 50mg']
    },
    history: [
      {
        id: uuidv4(),
        date: '2023-06-10',
        diagnosis: 'Migraine Management',
        notes: 'Patient reports 3-4 migraine episodes per month. Prescribed Sumatriptan.',
        prescription: [
          { id: uuidv4(), medicine: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '30 days' }
        ],
        files: []
      }
    ],
    notes: [
      {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        type: 'general',
        content: 'Patient responded well to Sumatriptan during last episode.',
        doctor: 'Dr. Sarah Johnson'
      }
    ],
    files: []
  }
];

const MyPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: 'All',
    ageGroup: 'All',
    lastVisit: '',
    tag: ''
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState('profile');
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [patients, setPatients] = useState(initialPatients);
  const [newPrescription, setNewPrescription] = useState({
    medicine: '',
    dosage: '',
    frequency: '',
    duration: ''
  });
  const [uploadingFile, setUploadingFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const patientsPerPage = 5;

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = filters.gender === 'All' || patient.gender === filters.gender;
    
    const matchesAge = filters.ageGroup === 'All' || (
      filters.ageGroup === '0-18' && patient.age <= 18 ||
      filters.ageGroup === '19-35' && patient.age > 18 && patient.age <= 35 ||
      filters.ageGroup === '36-60' && patient.age > 35 && patient.age <= 60 ||
      filters.ageGroup === '60+' && patient.age > 60
    );
    
    const matchesLastVisit = !filters.lastVisit || patient.lastVisit >= filters.lastVisit;
    
    const matchesTag = !filters.tag || patient.tags.includes(filters.tag);
    
    return matchesSearch && matchesGender && matchesAge && matchesLastVisit && matchesTag;
  });

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Handle outside click for modals
  const handleOutsideClick = (e, setModalState) => {
    if (e.target.classList.contains('modal-container')) {
      setModalState(false);
    }
  };

  // Add a new note
  const handleAddNote = () => {
    if (newNote.trim() && selectedPatient) {
      const note = {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        type: noteType,
        content: newNote,
        doctor: 'Dr. Sarah Johnson'
      };
      
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === selectedPatient.id 
            ? { ...patient, notes: [note, ...patient.notes] } 
            : patient
        )
      );
      
      setSelectedPatient(prev => ({
        ...prev,
        notes: [note, ...prev.notes]
      }));
      
      setNewNote('');
    }
  };

  // Delete a note
  const handleDeleteNote = (noteId) => {
    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === selectedPatient.id 
          ? { ...patient, notes: patient.notes.filter(note => note.id !== noteId) } 
          : patient
      )
    );
    
    setSelectedPatient(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId)
    }));
  };

  // Add a new prescription
  const handleAddPrescription = () => {
    if (newPrescription.medicine && selectedPatient) {
      const newVisit = {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        diagnosis: 'New Prescription',
        notes: 'Prescription added by doctor',
        prescription: [{
          id: uuidv4(),
          medicine: newPrescription.medicine,
          dosage: newPrescription.dosage,
          frequency: newPrescription.frequency,
          duration: newPrescription.duration
        }],
        files: []
      };
      
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === selectedPatient.id 
            ? { 
                ...patient, 
                history: [newVisit, ...patient.history],
                lastVisit: newVisit.date
              } 
            : patient
        )
      );
      
      setSelectedPatient(prev => ({
        ...prev,
        history: [newVisit, ...prev.history],
        lastVisit: newVisit.date
      }));
      
      setNewPrescription({
        medicine: '',
        dosage: '',
        frequency: '',
        duration: ''
      });
    }
  };

  // Handle file selection for upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Simulate file upload
  const handleFileUpload = () => {
    if (!selectedFile || !selectedPatient) return;

    setUploadingFile(true);
    setFileUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setFileUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      
      const newFile = {
        id: uuidv4(),
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        date: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(selectedFile)
      };
      
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === selectedPatient.id 
            ? { ...patient, files: [newFile, ...patient.files] } 
            : patient
        )
      );
      
      setSelectedPatient(prev => ({
        ...prev,
        files: [newFile, ...prev.files]
      }));
      
      setUploadingFile(false);
      setSelectedFile(null);
      setFileUploadProgress(0);
    }, 2500);
  };

  // Delete a file
  const handleDeleteFile = (fileId) => {
    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === selectedPatient.id 
          ? { ...patient, files: patient.files.filter(file => file.id !== fileId) } 
          : patient
      )
    );
    
    setSelectedPatient(prev => ({
      ...prev,
      files: prev.files.filter(file => file.id !== fileId)
    }));
  };

  // Generate PDF for prescription
  const generatePrescriptionPDF = (prescription) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Medical Prescription', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Patient: ${selectedPatient.name}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    // Prescription details
    doc.setFontSize(14);
    doc.text('Prescription Details:', 20, 70);
    
    doc.setFontSize(12);
    doc.text(`Medicine: ${prescription.medicine}`, 20, 80);
    doc.text(`Dosage: ${prescription.dosage}`, 20, 90);
    doc.text(`Frequency: ${prescription.frequency}`, 20, 100);
    doc.text(`Duration: ${prescription.duration}`, 20, 110);
    
    // Doctor signature
    doc.setFontSize(12);
    doc.text('Doctor Signature: ___________________', 20, 140);
    doc.text('Dr. Sarah Johnson', 20, 150);
    
    doc.save(`prescription_${selectedPatient.name}_${prescription.medicine}.pdf`);
  };

  // Generate PDF for patient history
  const generatePatientHistoryPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Patient Medical History', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Patient: ${selectedPatient.name}`, 20, 30);
    doc.text(`Age: ${selectedPatient.age}`, 20, 40);
    doc.text(`Gender: ${selectedPatient.gender}`, 20, 50);
    doc.text(`Blood Group: ${selectedPatient.details.bloodGroup}`, 20, 60);
    
    // Medical history table
    doc.setFontSize(14);
    doc.text('Medical History:', 20, 80);
    
    const historyData = selectedPatient.history.map(visit => [
      visit.date,
      visit.diagnosis,
      visit.notes,
      visit.prescription.map(p => `${p.medicine} (${p.dosage})`).join(', ')
    ]);
    
    doc.autoTable({
      startY: 85,
      head: [['Date', 'Diagnosis', 'Notes', 'Prescription']],
      body: historyData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    });
    
    // Notes section
    doc.setFontSize(14);
    doc.text('Doctor Notes:', 20, doc.autoTable.previous.finalY + 20);
    
    const notesData = selectedPatient.notes.map(note => [
      note.date,
      note.type.charAt(0).toUpperCase() + note.type.slice(1),
      note.content,
      note.doctor
    ]);
    
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 25,
      head: [['Date', 'Type', 'Content', 'Doctor']],
      body: notesData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    });
    
    doc.save(`medical_history_${selectedPatient.name}.pdf`);
  };

  // Generate PDF for single visit
  const generateVisitPDF = (visit) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Medical Visit Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Patient: ${selectedPatient.name}`, 20, 30);
    doc.text(`Date: ${visit.date}`, 20, 40);
    doc.text(`Diagnosis: ${visit.diagnosis}`, 20, 50);
    
    // Visit details
    doc.setFontSize(14);
    doc.text('Visit Details:', 20, 70);
    doc.setFontSize(12);
    doc.text(visit.notes, 20, 80, { maxWidth: 170 });
    
    // Prescription
    if (visit.prescription && visit.prescription.length > 0) {
      doc.setFontSize(14);
      doc.text('Prescription:', 20, doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 100);
      
      const prescriptionData = visit.prescription.map(p => [
        p.medicine,
        p.dosage,
        p.frequency,
        p.duration
      ]);
      
      doc.autoTable({
        startY: (doc.previousAutoTable ? doc.previousAutoTable.finalY : 100) + 25,
        head: [['Medicine', 'Dosage', 'Frequency', 'Duration']],
        body: prescriptionData,
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255
        }
      });
    }
    
    // Doctor signature
    doc.setFontSize(12);
    doc.text('Doctor Signature: ___________________', 20, doc.autoTable.previous.finalY + 20);
    doc.text('Dr. Sarah Johnson', 20, doc.autoTable.previous.finalY + 30);
    
    doc.save(`visit_report_${selectedPatient.name}_${visit.date}.pdf`);
  };

  return (
    <div className="relative p-4 md:p-8">
      <style>{styles}</style>
      
      {/* Header - Always visible above blur */}
      <div className={`patient-header ${selectedPatient ? 'relative z-50' : ''}`}>
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-3 animate-scaleIn">
            <div className="relative">
              <FaUser className="text-3xl md:text-4xl text-blue-600" aria-hidden="true" />
              <MdMedicalServices className="absolute -bottom-1 -right-1 text-lg md:text-xl bg-white rounded-full p-1 text-blue-600 border-2 border-blue-600" />
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center">
              My Patients
              <span className="ml-2 md:ml-3 text-xs md:text-sm font-normal bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full">
                {patients.length} total
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content with Conditional Blur */}
      <div className={`transition-all duration-300 ${selectedPatient ? 'filter blur-sm opacity-90' : ''}`}>
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4 md:gap-6">
          <div className="relative flex-1 max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search patients"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center px-4 md:px-5 py-2 md:py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all group w-full md:w-auto justify-center"
            aria-label="Open filter options"
          >
            <FaFilter className="mr-2 transition-transform group-hover:rotate-180" />
            Filters
          </button>
        </div>

        {/* Patients Table - Responsive */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Age / Gender
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPatients.length > 0 ? (
                  currentPatients.map((patient, index) => (
                    <tr key={patient.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={patient.avatar} alt={patient.name} />
                          </div>
                          <div className="ml-2 md:ml-4">
                            <div className="font-semibold text-gray-900 text-sm md:text-base">{patient.name}</div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {patient.tags.map(tag => (
                                <span key={tag} className="mr-1 px-1 md:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-600">
                        {patient.id}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900 text-sm md:text-base">{patient.age}</div>
                        <div className="text-xs md:text-sm text-gray-600">{patient.gender}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaPhone className="mr-1 text-gray-400" />
                          {patient.contact.phone}
                        </div>
                        <div className="flex items-center">
                          <FaEnvelope className="mr-1 text-gray-400" />
                          {patient.contact.email}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1 text-gray-400" />
                          {patient.lastVisit}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {patient.diagnosis}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                        <div className="flex flex-col space-y-1 md:space-y-2">
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setView('profile');
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors flex items-center text-xs md:text-sm"
                            aria-label={`View profile for ${patient.name}`}
                          >
                            <FaEye className="mr-1" /> View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setView('notes');
                            }}
                            className="text-yellow-600 hover:text-yellow-900 transition-colors flex items-center text-xs md:text-sm"
                            aria-label={`Add note for ${patient.name}`}
                          >
                            <FaNotesMedical className="mr-1" /> Note
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setView('prescriptions');
                            }}
                            className="text-green-600 hover:text-green-900 transition-colors flex items-center text-xs md:text-sm"
                            aria-label={`Prescribe for ${patient.name}`}
                          >
                            <FaPills className="mr-1" /> Prescribe
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setView('history');
                            }}
                            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center text-xs md:text-sm"
                            aria-label={`View history for ${patient.name}`}
                          >
                            <AiOutlineHistory className="mr-1" /> History
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No patients found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Table */}
          <div className="md:hidden">
            {currentPatients.length > 0 ? (
              currentPatients.map((patient) => (
                <div key={patient.id} className="patient-table-row">
                  <div className="patient-table-cell" data-label="Patient">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full mr-2" src={patient.avatar} alt={patient.name} />
                      <span className="font-medium">{patient.name}</span>
                    </div>
                  </div>
                  <div className="patient-table-cell" data-label="ID">{patient.id}</div>
                  <div className="patient-table-cell" data-label="Age/Gender">
                    {patient.age} / {patient.gender}
                  </div>
                  <div className="patient-table-cell" data-label="Contact">
                    <div className="flex flex-col">
                      <span className="flex items-center">
                        <FaPhone className="mr-1 text-gray-400 text-xs" />
                        {patient.contact.phone}
                      </span>
                      <span className="flex items-center">
                        <FaEnvelope className="mr-1 text-gray-400 text-xs" />
                        {patient.contact.email}
                      </span>
                    </div>
                  </div>
                  <div className="patient-table-cell" data-label="Last Visit">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-gray-400 text-xs" />
                      {patient.lastVisit}
                    </div>
                  </div>
                  <div className="patient-table-cell" data-label="Condition">
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {patient.diagnosis}
                    </span>
                  </div>
                  <div className="patient-actions">
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setView('profile');
                      }}
                      className="text-blue-600 hover:text-blue-900 text-xs flex items-center"
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setView('notes');
                      }}
                      className="text-yellow-600 hover:text-yellow-900 text-xs flex items-center"
                    >
                      <FaNotesMedical className="mr-1" /> Note
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setView('prescriptions');
                      }}
                      className="text-green-600 hover:text-green-900 text-xs flex items-center"
                    >
                      <FaPills className="mr-1" /> Rx
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setView('history');
                      }}
                      className="text-gray-600 hover:text-gray-900 text-xs flex items-center"
                    >
                      <AiOutlineHistory className="mr-1" /> History
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">
                No patients found matching your criteria
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredPatients.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6">
              <div className="text-xs md:text-sm text-gray-600 mb-2 md:mb-0">
                Showing {indexOfFirstPatient + 1} to {Math.min(indexOfLastPatient, filteredPatients.length)} of {filteredPatients.length} patients
              </div>
              <div className="flex space-x-2 md:space-x-3">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 md:px-5 py-1.5 md:py-2 border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-xs md:text-sm"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 md:px-5 py-1.5 md:py-2 border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-xs md:text-sm"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div
          className="modal-container fixed inset-0 flex items-center justify-center z-50 ml-0 md:ml-64 pt-16 modal-backdrop"
          onClick={(e) => handleOutsideClick(e, setShowFilterModal)}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-fadeIn filter-modal">
            <div className="flex justify-between items-start">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                <FaFilter className="mr-2 text-blue-600" />
                Filter Patients
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close filter modal"
              >
                &times;
              </button>
            </div>
            <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-900 flex items-center">
                  <FaVenusMars className="mr-2" />
                  Gender
                </label>
                <select
                  className="mt-1 md:mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs md:text-sm"
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  aria-label="Filter by gender"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-900 flex items-center">
                  <FaBirthdayCake className="mr-2" />
                  Age Group
                </label>
                <select
                  className="mt-1 md:mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs md:text-sm"
                  value={filters.ageGroup}
                  onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
                  aria-label="Filter by age group"
                >
                  <option value="All">All Ages</option>
                  <option value="0-18">0-18 years</option>
                  <option value="19-35">19-35 years</option>
                  <option value="36-60">36-60 years</option>
                  <option value="60+">60+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-900 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Last Visit After
                </label>
                <input
                  type="date"
                  className="mt-1 md:mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs md:text-sm"
                  value={filters.lastVisit}
                  onChange={(e) => setFilters({ ...filters, lastVisit: e.target.value })}
                  aria-label="Filter by last visit date"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-900 flex items-center">
                  <MdOutlineMedicalInformation className="mr-2" />
                  Condition Tag
                </label>
                <select
                  className="mt-1 md:mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs md:text-sm"
                  value={filters.tag}
                  onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                  aria-label="Filter by condition tag"
                >
                  <option value="">All Conditions</option>
                  <option value="Diabetic">Diabetic</option>
                  <option value="Hypertension">Hypertension</option>
                  <option value="Chronic Migraine">Chronic Migraine</option>
                  <option value="Heart Patient">Heart Patient</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 md:space-x-4 pt-3 md:pt-4">
                <button
                  onClick={() => {
                    setFilters({
                      gender: 'All',
                      ageGroup: 'All',
                      lastVisit: '',
                      tag: ''
                    });
                    setShowFilterModal(false);
                  }}
                  className="px-3 md:px-5 py-1.5 md:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center text-xs md:text-sm"
                  aria-label="Reset filters"
                >
                  <FaTimes className="mr-1 md:mr-2" />
                  Reset
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-3 md:px-5 py-1.5 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center text-xs md:text-sm"
                  aria-label="Apply filters"
                >
                  <FaCheck className="mr-1 md:mr-2" />
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div
          className="modal-container fixed inset-0 flex items-center justify-center z-50 ml-0 md:ml-64 pt-16 modal-backdrop"
          onClick={(e) => handleOutsideClick(e, setSelectedPatient)}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-2 md:mx-0 p-4 md:p-8 animate-fadeIn patient-detail-modal">
            <div className="flex justify-between items-start">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Patient Profile: {selectedPatient.name}
              </h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
                aria-label="Close patient profile"
              >
                &times;
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 mt-4 md:mt-6">
              <button
                onClick={() => setView('profile')}
                className={`py-2 md:py-4 px-3 md:px-6 font-medium text-xs md:text-sm focus:outline-none whitespace-nowrap ${
                  view === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setView('history')}
                className={`py-2 md:py-4 px-3 md:px-6 font-medium text-xs md:text-sm focus:outline-none whitespace-nowrap ${
                  view === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Medical History
              </button>
              <button
                onClick={() => setView('prescriptions')}
                className={`py-2 md:py-4 px-3 md:px-6 font-medium text-xs md:text-sm focus:outline-none whitespace-nowrap ${
                  view === 'prescriptions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Prescriptions
              </button>
              <button
                onClick={() => setView('notes')}
                className={`py-2 md:py-4 px-3 md:px-6 font-medium text-xs md:text-sm focus:outline-none whitespace-nowrap ${
                  view === 'notes' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Doctor Notes
              </button>
              <button
                onClick={() => setView('files')}
                className={`py-2 md:py-4 px-3 md:px-6 font-medium text-xs md:text-sm focus:outline-none whitespace-nowrap ${
                  view === 'files' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Files
              </button>
            </div>

            {/* Profile View */}
            {view === 'profile' && (
              <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <div className="flex items-center mb-4 md:mb-6">
                    <img className="h-16 w-16 md:h-20 md:w-20 rounded-full" src={selectedPatient.avatar} alt={selectedPatient.name} />
                    <div className="ml-3 md:ml-4">
                      <h4 className="text-lg md:text-xl font-bold">{selectedPatient.name}</h4>
                      <div className="text-sm md:text-base text-gray-600">
                        {selectedPatient.gender}, {selectedPatient.age} years
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 flex items-center text-sm md:text-base">
                        <FaIdCard className="mr-2 text-blue-600" />
                        Identification
                      </h5>
                      <p className="text-gray-600 ml-6 md:ml-7 text-xs md:text-sm">CNIC: {selectedPatient.details.cnic}</p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 flex items-center text-sm md:text-base">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        Address
                      </h5>
                      <p className="text-gray-600 ml-6 md:ml-7 text-xs md:text-sm">{selectedPatient.details.address}</p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 flex items-center text-sm md:text-base">
                        <FaTint className="mr-2 text-blue-600" />
                        Blood Group
                      </h5>
                      <p className="text-gray-600 ml-6 md:ml-7 text-xs md:text-sm">{selectedPatient.details.bloodGroup}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-4 md:mb-6">
                    <h5 className="font-semibold text-gray-900 flex items-center text-sm md:text-base">
                      <MdMedicalServices className="mr-2 text-blue-600" />
                      Medical Summary
                    </h5>
                    <div className="mt-2 ml-6 md:ml-7">
                      <div className="mb-2 md:mb-3">
                        <h6 className="font-medium text-gray-900 text-xs md:text-sm">Conditions:</h6>
                        <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                          {selectedPatient.details.conditions.map(condition => (
                            <span key={condition} className="px-2 py-0.5 md:py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mb-2 md:mb-3">
                        <h6 className="font-medium text-gray-900 text-xs md:text-sm">Allergies:</h6>
                        <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                          {selectedPatient.details.allergies.map(allergy => (
                            <span key={allergy} className="px-2 py-0.5 md:py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h6 className="font-medium text-gray-900 text-xs md:text-sm">Current Medications:</h6>
                        <ul className="mt-1 space-y-1">
                          {selectedPatient.details.medications.map(med => (
                            <li key={med} className="text-gray-600 text-xs md:text-sm">{med}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                    <button 
                      onClick={generatePatientHistoryPDF}
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-center text-xs md:text-sm"
                    >
                      <FaFilePdf className="mr-1 md:mr-2" />
                      Download Full History
                    </button>
                    <label className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-center text-xs md:text-sm cursor-pointer">
                      <FaFileUpload className="mr-1 md:mr-2" />
                      Upload Report
                      <input 
                        type="file" 
                        className="file-upload" 
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Medical History View */}
            {view === 'history' && (
              <div className="mt-4 md:mt-6">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <AiOutlineHistory className="mr-2 text-blue-600" />
                  Visit History
                </h4>

                <div className="space-y-4 md:space-y-6">
                  {selectedPatient.history.length > 0 ? (
                    selectedPatient.history.map((visit) => (
                      <div key={visit.id} className="border-l-2 border-blue-200 pl-3 md:pl-4 relative">
                        <div className="absolute -left-1.5 md:-left-2 top-3 h-3 w-3 md:h-4 md:w-4 rounded-full bg-blue-600"></div>
                        <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-bold text-gray-900 text-sm md:text-base">{visit.diagnosis}</h5>
                              <div className="text-xs md:text-sm text-gray-600 flex items-center">
                                <FaCalendarAlt className="mr-1" />
                                {visit.date}
                              </div>
                            </div>
                            <button 
                              onClick={() => generateVisitPDF(visit)}
                              className="text-blue-600 hover:text-blue-800 flex items-center text-xs md:text-sm"
                            >
                              <FaFilePdf className="mr-1" />
                              View Report
                            </button>
                          </div>
                          <div className="mt-2 md:mt-3">
                            <h6 className="font-medium text-gray-900 text-xs md:text-sm">Notes:</h6>
                            <p className="text-gray-600 text-xs md:text-sm">{visit.notes}</p>
                          </div>
                          {visit.prescription && visit.prescription.length > 0 && (
                            <div className="mt-2 md:mt-3">
                              <h6 className="font-medium text-gray-900 text-xs md:text-sm">Prescribed:</h6>
                              <ul className="mt-1 space-y-1">
                                {visit.prescription.map((med) => (
                                  <li key={med.id} className="text-gray-600 text-xs md:text-sm">
                                    {med.medicine} - {med.dosage} ({med.frequency}) for {med.duration}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {visit.files && visit.files.length > 0 && (
                            <div className="mt-2 md:mt-3">
                              <h6 className="font-medium text-gray-900 text-xs md:text-sm">Attachments:</h6>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {visit.files.map(file => (
                                  <a 
                                    key={file.id} 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-xs md:text-sm flex items-center"
                                  >
                                    <FaFilePdf className="mr-1" />
                                    {file.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No medical history available for this patient
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Prescriptions View */}
            {view === 'prescriptions' && (
              <div className="mt-4 md:mt-6">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <FaPills className="mr-2 text-blue-600" />
                  Prescription History
                </h4>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Medicine
                        </th>
                        <th className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Dosage
                        </th>
                        <th className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPatient.history.flatMap((visit) => 
                        visit.prescription.map((prescription) => (
                          <tr key={prescription.id}>
                            <td className="px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-600">
                              {visit.date}
                            </td>
                            <td className="px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                              {prescription.medicine}
                            </td>
                            <td className="px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-600">
                              {prescription.dosage}
                            </td>
                            <td className="px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-600">
                              {prescription.duration}
                            </td>
                            <td className="px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                              <button 
                                onClick={() => generatePrescriptionPDF(prescription)}
                                className="text-blue-600 hover:text-blue-900 mr-2 md:mr-3 flex items-center text-xs md:text-sm"
                              >
                                <FaPrint className="mr-1" /> Print
                              </button>
                              <button 
                                onClick={() => generatePrescriptionPDF(prescription)}
                                className="text-blue-600 hover:text-blue-900 flex items-center text-xs md:text-sm"
                              >
                                <FaFilePdf className="mr-1" /> PDF
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 md:mt-6 p-4 md:p-6 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">New Prescription</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4 prescription-grid">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700">Medicine</label>
                      <input 
                        type="text" 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 md:py-2 px-2 md:px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                        value={newPrescription.medicine}
                        onChange={(e) => setNewPrescription({...newPrescription, medicine: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700">Dosage</label>
                      <input 
                        type="text" 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 md:py-2 px-2 md:px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                        value={newPrescription.dosage}
                        onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700">Frequency</label>
                      <input 
                        type="text" 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 md:py-2 px-2 md:px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                        value={newPrescription.frequency}
                        onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700">Duration</label>
                      <input 
                        type="text" 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 md:py-2 px-2 md:px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                        value={newPrescription.duration}
                        onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddPrescription}
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center text-xs md:text-sm"
                      disabled={!newPrescription.medicine}
                    >
                      <FaPills className="mr-1 md:mr-2" />
                      Add Prescription
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes View */}
            {view === 'notes' && (
              <div className="mt-4 md:mt-6">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <FaNotesMedical className="mr-2 text-blue-600" />
                  Doctor Notes
                </h4>

                <div className="mb-4 md:mb-6">
                  <div className="flex items-center mb-2 md:mb-3">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mr-2 md:mr-3">Note Type:</label>
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value)}
                      className="border border-gray-300 rounded-md shadow-sm py-1 md:py-1.5 px-2 md:px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                    >
                      <option value="general">General Note</option>
                      <option value="follow-up">Follow-up Required</option>
                      <option value="critical">Critical Note</option>
                    </select>
                  </div>
                  <textarea
                    rows="4"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-1.5 md:py-2 px-2 md:px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                    placeholder="Enter your notes here..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end mt-2 md:mt-3">
                    <button
                      onClick={handleAddNote}
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center text-xs md:text-sm"
                      disabled={!newNote.trim()}
                    >
                      <FaNotesMedical className="mr-1 md:mr-2" />
                      Add Note
                    </button>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {selectedPatient.notes.length > 0 ? (
                    selectedPatient.notes.map((note) => (
                      <div 
                        key={note.id} 
                        className={`border-l-2 pl-3 md:pl-4 relative ${
                          note.type === 'critical' ? 'border-red-200' : 
                          note.type === 'follow-up' ? 'border-yellow-200' : 'border-blue-200'
                        }`}
                      >
                        <div 
                          className={`absolute -left-1.5 md:-left-2 top-3 h-3 w-3 md:h-4 md:w-4 rounded-full ${
                            note.type === 'critical' ? 'bg-red-600' : 
                            note.type === 'follow-up' ? 'bg-yellow-600' : 'bg-blue-600'
                          }`}
                        ></div>
                        <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className={`font-bold text-gray-900 text-sm md:text-base ${
                                note.type === 'critical' ? 'text-red-800' : 
                                note.type === 'follow-up' ? 'text-yellow-800' : 'text-blue-800'
                              }`}>
                                {note.type.charAt(0).toUpperCase() + note.type.slice(1).replace('-', ' ')}
                              </h5>
                              <div className="text-xs md:text-sm text-gray-600 flex items-center">
                                <FaCalendarAlt className="mr-1" />
                                {note.date}
                              </div>
                              <div className="text-xs md:text-sm text-gray-600 mt-1">
                                By: {note.doctor}
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-600 text-xs md:text-sm">{note.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No notes available for this patient
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Files View */}
            {view === 'files' && (
              <div className="mt-4 md:mt-6">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <FaFilePdf className="mr-2 text-blue-600" />
                  Patient Files
                </h4>

                {/* File Upload Section */}
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 file-upload-section">
                    <label className="flex-1 w-full">
                      <span className="sr-only">Choose file</span>
                      <input 
                        type="file" 
                        className="block w-full text-xs md:text-sm text-gray-500
                          file:mr-2 md:file:mr-4 file:py-1.5 md:file:py-2 file:px-3 md:file:px-4
                          file:rounded-md file:border-0
                          file:text-xs md:file:text-sm file:font-medium
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                          cursor-pointer"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                    {selectedFile && (
                      <div className="flex items-center gap-2 text-xs md:text-sm">
                        <span className="font-medium">{selectedFile.name}</span>
                        <span className="text-gray-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                        <button 
                          onClick={() => setSelectedFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={handleFileUpload}
                      disabled={!selectedFile || uploadingFile}
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center text-xs md:text-sm ${
                        uploadingFile ? 'bg-gray-300 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {uploadingFile ? (
                        <>
                          <span className="mr-2">Uploading... {fileUploadProgress}%</span>
                        </>
                      ) : (
                        <>
                          <FaFileUpload className="mr-1 md:mr-2" />
                          Upload
                        </>
                      )}
                    </button>
                  </div>
                  {uploadingFile && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${fileUploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Files List */}
                <div className="space-y-3 md:space-y-4">
                  {selectedPatient.files.length > 0 ? (
                    selectedPatient.files.map((file) => (
                      <div 
                        key={file.id} 
                        className="file-item bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <FaFilePdf className="text-red-500 mr-2 md:mr-3" />
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm md:text-base">{file.name}</h5>
                              <div className="text-xs md:text-sm text-gray-500">
                                {file.type} • {(file.size / 1024).toFixed(1)} KB • {file.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <a 
                              href={file.url} 
                              download={file.name}
                              className="text-blue-600 hover:text-blue-800 text-xs md:text-sm flex items-center"
                            >
                              <FaFileDownload className="mr-1" />
                            </a>
                            <a 
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs md:text-sm flex items-center"
                            >
                              <FaEye className="mr-1" />
                            </a>
                            <button 
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No files uploaded for this patient
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPatients;