import React, { useState, useEffect } from 'react';
import {
  FaSearch, FaUser, FaPhone, FaIdCard, FaFilter,
  FaClipboardList, FaPills, FaVial, FaHeartbeat,
  FaAllergies, FaStickyNote, FaFilePdf,
  FaFileUpload, FaEdit, FaPrint, FaShare,
  FaChevronDown, FaChevronUp, FaCalendarAlt,
  FaCheckCircle, FaPlus, FaTimes, FaClock
} from 'react-icons/fa';
import { GiScalpel } from 'react-icons/gi';
import { AiFillFileImage, AiOutlineUser } from 'react-icons/ai';
import { MdOutlineMedicalServices } from 'react-icons/md';

const MedicalRecords = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('visits');
  const [expandedSections, setExpandedSections] = useState({
    visits: true,
    prescriptions: true,
    labTests: false,
    imaging: false,
    surgeries: false,
    conditions: false,
  });
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newRecord, setNewRecord] = useState({});
  const [fileToUpload, setFileToUpload] = useState(null);
  const [recordType, setRecordType] = useState('visit');

  // Form states
  const [visitForm, setVisitForm] = useState({
    date: '',
    doctor: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    vitals: { bp: '', temp: '', pulse: '' }
  });
  const [prescriptionForm, setPrescriptionForm] = useState({
    medicine: '',
    dosage: '',
    frequency: '',
    duration: '',
    doctor: '',
    date: '',
    status: 'Active',
    refills: 0
  });
  const [labTestForm, setLabTestForm] = useState({
    testType: '',
    date: '',
    orderedBy: '',
    status: 'Pending'
  });
  const [imagingForm, setImagingForm] = useState({
    type: '',
    date: '',
    orderedBy: '',
    status: 'Pending',
    remarks: ''
  });
  const [surgeryForm, setSurgeryForm] = useState({
    procedure: '',
    date: '',
    surgeon: '',
    facility: '',
    anesthesia: '',
    duration: '',
    outcome: 'Successful',
    notes: '',
    followUp: ''
  });
  const [conditionForm, setConditionForm] = useState({
    type: '',
    category: 'condition', // or 'allergy'
    since: '',
    status: '',
    severity: '',
    notes: ''
  });

  // Mock data for departments
  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology'];

  // Generate dummy data for multiple patients
  const generateDummyPatients = () => {
    const dummyPatients = [];
    const conditions = ['Hypertension', 'Diabetes', 'Asthma', 'Hyperlipidemia', 'Osteoarthritis'];
    const allergies = ['Peanuts', 'Penicillin', 'Shellfish', 'Latex', 'Dust Mites'];
    const medications = ['Atorvastatin', 'Metformin', 'Lisinopril', 'Albuterol', 'Ibuprofen'];
    const testTypes = ['CBC', 'Lipid Panel', 'HbA1c', 'TSH', 'Liver Function'];
    const imagingTypes = ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'Mammogram'];
    const procedures = ['Appendectomy', 'Knee Replacement', 'Cataract Surgery', 'Hernia Repair', 'Cholecystectomy'];
    const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'];
    
    for (let i = 1; i <= 10; i++) {
      const patientId = `MRN-${i.toString().padStart(3, '0')}`;
      const gender = Math.random() > 0.5 ? 'Male' : 'Female';
      const age = Math.floor(Math.random() * 50) + 18;
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const lastVisit = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      
      // Generate random visits
      const visits = [];
      const visitCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 1; j <= visitCount; j++) {
        visits.push({
          id: `VIS-${i}-${j}`,
          date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          doctor: doctors[Math.floor(Math.random() * doctors.length)],
          symptoms: ['Chest pain', 'Headache', 'Fatigue', 'Shortness of breath', 'Fever'][Math.floor(Math.random() * 5)],
          diagnosis: conditions[Math.floor(Math.random() * conditions.length)],
          treatment: medications[Math.floor(Math.random() * medications.length)],
          vitals: {
            bp: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 30) + 60}`,
            temp: `${(Math.random() * 3 + 97).toFixed(1)}°F`,
            pulse: `${Math.floor(Math.random() * 40) + 60} bpm`
          },
          notes: 'Follow up in 4 weeks'
        });
      }
      
      // Generate random prescriptions
      const prescriptions = [];
      const prescriptionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 1; j <= prescriptionCount; j++) {
        prescriptions.push({
          id: `RX-${i}-${j}`,
          medicine: medications[Math.floor(Math.random() * medications.length)],
          dosage: `${Math.floor(Math.random() * 500) + 50} mg`,
          frequency: ['Once daily', 'Twice daily', 'Three times daily', 'As needed'][Math.floor(Math.random() * 4)],
          duration: `${Math.floor(Math.random() * 30) + 7} days`,
          doctor: doctors[Math.floor(Math.random() * doctors.length)],
          date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          status: ['Active', 'Completed', 'Cancelled'][Math.floor(Math.random() * 3)],
          refills: Math.floor(Math.random() * 5)
        });
      }
      
      // Generate random lab tests
      const labTests = [];
      const labTestCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 1; j <= labTestCount; j++) {
        labTests.push({
          id: `LAB-${i}-${j}`,
          testType: testTypes[Math.floor(Math.random() * testTypes.length)],
          date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          orderedBy: doctors[Math.floor(Math.random() * doctors.length)],
          status: ['Pending', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)],
          results: 'Results pending',
          interpretation: 'Pending interpretation'
        });
      }
      
      // Generate random imaging
      const imaging = [];
      const imagingCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 1; j <= imagingCount; j++) {
        imaging.push({
          id: `IMG-${i}-${j}`,
          type: imagingTypes[Math.floor(Math.random() * imagingTypes.length)],
          date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          orderedBy: doctors[Math.floor(Math.random() * doctors.length)],
          status: ['Pending', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)],
          remarks: 'No significant findings',
          image: `https://picsum.photos/300/200?random=${i}${j}`
        });
      }
      
      // Generate random surgeries
      const surgeries = [];
      const surgeryCount = Math.floor(Math.random() * 2);
      for (let j = 1; j <= surgeryCount; j++) {
        surgeries.push({
          id: `SUR-${i}-${j}`,
          procedure: procedures[Math.floor(Math.random() * procedures.length)],
          date: new Date(Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          surgeon: doctors[Math.floor(Math.random() * doctors.length)],
          facility: ['General Hospital', 'City Medical Center', 'University Hospital'][Math.floor(Math.random() * 3)],
          anesthesia: ['General', 'Local', 'Regional'][Math.floor(Math.random() * 3)],
          duration: `${Math.floor(Math.random() * 4) + 1} hours`,
          outcome: ['Successful', 'Complicated', 'Unsuccessful'][Math.floor(Math.random() * 3)],
          notes: 'Patient recovered well',
          followUp: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        });
      }
      
      // Generate random conditions
      const conditionsList = [];
      const conditionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 1; j <= conditionCount; j++) {
        conditionsList.push({
          id: `CON-${i}-${j}`,
          type: conditions[Math.floor(Math.random() * conditions.length)],
          since: `${new Date().getFullYear() - Math.floor(Math.random() * 20)}`,
          status: ['Active', 'Controlled', 'Resolved'][Math.floor(Math.random() * 3)],
          severity: ['Mild', 'Moderate', 'Severe'][Math.floor(Math.random() * 3)],
          notes: 'Managed with medication'
        });
      }
      
      // Generate random allergies
      const allergyCount = Math.floor(Math.random() * 2);
      for (let j = 1; j <= allergyCount; j++) {
        conditionsList.push({
          id: `ALL-${i}-${j}`,
          type: `${allergies[Math.floor(Math.random() * allergies.length)]} Allergy`,
          severity: ['Mild', 'Moderate', 'Severe', 'Life-threatening'][Math.floor(Math.random() * 4)],
          reaction: ['Hives', 'Swelling', 'Anaphylaxis', 'Rash'][Math.floor(Math.random() * 4)],
          notes: 'Patient carries epinephrine auto-injector'
        });
      }
      
      dummyPatients.push({
        id: patientId,
        name: `${gender === 'Male' ? 'Mr.' : 'Ms.'} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
        age,
        gender,
        contact: `+1 555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        bloodGroup,
        lastVisit,
        department,
        profilePic: `https://randomuser.me/api/portraits/${gender.toLowerCase()}/${i}.jpg`,
        visits,
        prescriptions,
        labTests,
        imaging,
        surgeries,
        conditions: conditionsList
      });
    }
    
    return dummyPatients;
  };

  // Simulate API call to fetch patient data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate dummy patient data
        const dummyPatients = generateDummyPatients();
        
        setPatients(dummyPatients);
        if (dummyPatients.length > 0) {
          setSelectedPatient(dummyPatients[0]);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search criteria
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      (searchType === 'name' && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchType === 'id' && patient.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === 'all' || patient.department === departmentFilter;
    const matchesDate = dateFilter === '' || patient.lastVisit === dateFilter;
    return matchesSearch && matchesDepartment && matchesDate;
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle form input changes
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    
    switch(formType) {
      case 'visit':
        if (name.startsWith('vitals.')) {
          const vitalField = name.split('.')[1];
          setVisitForm(prev => ({
            ...prev,
            vitals: {
              ...prev.vitals,
              [vitalField]: value
            }
          }));
        } else {
          setVisitForm(prev => ({ ...prev, [name]: value }));
        }
        break;
      case 'prescription':
        setPrescriptionForm(prev => ({ ...prev, [name]: value }));
        break;
      case 'labTest':
        setLabTestForm(prev => ({ ...prev, [name]: value }));
        break;
      case 'imaging':
        setImagingForm(prev => ({ ...prev, [name]: value }));
        break;
      case 'surgery':
        setSurgeryForm(prev => ({ ...prev, [name]: value }));
        break;
      case 'condition':
        setConditionForm(prev => ({ ...prev, [name]: value }));
        break;
      default:
        break;
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  // Generate PDF content
  const generatePDFContent = () => {
    if (!selectedPatient) return null;
    
    const currentDate = new Date().toLocaleDateString();
    const content = {
      title: `${selectedPatient.name} - Medical Records Summary`,
      patientInfo: {
        name: selectedPatient.name,
        mrn: selectedPatient.id,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        bloodGroup: selectedPatient.bloodGroup,
        department: selectedPatient.department,
        lastVisit: selectedPatient.lastVisit
      },
      records: selectedPatient[activeTab],
      generatedOn: currentDate
    };
    
    return content;
  };

  // Export to PDF
  const handleExportPDF = () => {
    const content = generatePDFContent();
    if (!content) return;
    
    // In a real app, this would generate an actual PDF document
    console.log('PDF Content:', content);
    alert(`PDF generated for ${selectedPatient.name}'s ${activeTab} records. Check console for details.`);
  };

  // Share with doctor
  const handleShareWithDoctor = () => {
    if (!selectedPatient) return;
    
    // In a real app, this would open a doctor selection dialog and send the records
    console.log('Sharing records:', {
      patient: selectedPatient.name,
      mrn: selectedPatient.id,
      records: selectedPatient[activeTab]
    });
    alert(`Sharing ${activeTab} records for ${selectedPatient.name} with doctor. Check console for details.`);
  };

  // Submit new record
  const handleSubmitRecord = (e) => {
    e.preventDefault();
    
    if (!selectedPatient) return;
    
    const newId = `NEW-${Date.now()}`;
    const currentDate = new Date().toISOString().split('T')[0];
    
    switch(recordType) {
      case 'visit':
        const newVisit = {
          id: newId,
          date: currentDate,
          ...visitForm,
          vitals: visitForm.vitals
        };
        
        setPatients(prev => prev.map(patient => 
          patient.id === selectedPatient.id 
            ? { 
                ...patient, 
                visits: [...patient.visits, newVisit],
                lastVisit: currentDate
              } 
            : patient
        ));
        break;
        
      case 'prescription':
        const newPrescription = {
          id: newId,
          date: currentDate,
          ...prescriptionForm
        };
        
        setPatients(prev => prev.map(patient => 
          patient.id === selectedPatient.id 
            ? { ...patient, prescriptions: [...patient.prescriptions, newPrescription] } 
            : patient
        ));
        break;
        
      case 'labTest':
        const newLabTest = {
          id: newId,
          date: currentDate,
          ...labTestForm,
          status: 'Pending',
          results: '',
          interpretation: ''
        };
        
        setPatients(prev => prev.map(patient => 
          patient.id === selectedPatient.id 
            ? { ...patient, labTests: [...patient.labTests, newLabTest] } 
            : patient
        ));
        break;
        
      case 'imaging':
        const newImaging = {
          id: newId,
          date: currentDate,
          ...imagingForm,
          status: 'Pending',
          image: fileToUpload ? URL.createObjectURL(fileToUpload) : ''
        };
        
        setPatients(prev => prev.map(patient => 
          patient.id === selectedPatient.id 
            ? { ...patient, imaging: [...patient.imaging, newImaging] } 
            : patient
        ));
        break;
        
      case 'surgery':
        const newSurgery = {
          id: newId,
          ...surgeryForm
        };
        
        setPatients(prev => prev.map(patient => 
          patient.id === selectedPatient.id 
            ? { ...patient, surgeries: [...patient.surgeries, newSurgery] } 
            : patient
        ));
        break;
        
      case 'condition':
        const newCondition = {
          id: newId,
          ...conditionForm
        };
        
        setPatients(prev => prev.map(patient => 
          patient.id === selectedPatient.id 
            ? { 
                ...patient, 
                conditions: [...patient.conditions, newCondition] 
              } 
            : patient
        ));
        break;
        
      default:
        break;
    }
    
    // Reset forms and close modal
    setVisitForm({
      date: '',
      doctor: '',
      symptoms: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      vitals: { bp: '', temp: '', pulse: '' }
    });
    setPrescriptionForm({
      medicine: '',
      dosage: '',
      frequency: '',
      duration: '',
      doctor: '',
      date: '',
      status: 'Active',
      refills: 0
    });
    setLabTestForm({
      testType: '',
      date: '',
      orderedBy: '',
      status: 'Pending'
    });
    setImagingForm({
      type: '',
      date: '',
      orderedBy: '',
      status: 'Pending',
      remarks: ''
    });
    setSurgeryForm({
      procedure: '',
      date: '',
      surgeon: '',
      facility: '',
      anesthesia: '',
      duration: '',
      outcome: 'Successful',
      notes: '',
      followUp: ''
    });
    setConditionForm({
      type: '',
      category: 'condition',
      since: '',
      status: '',
      severity: '',
      notes: ''
    });
    setFileToUpload(null);
    setShowAddRecordModal(false);
  };

  // Handle upload report
  const handleUploadReport = (e) => {
    e.preventDefault();
    
    if (!fileToUpload || !selectedPatient) return;
    
    const newId = `REP-${Date.now()}`;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Determine which tab is active to attach the report
    switch(activeTab) {
      case 'labTests':
        const newLabReport = {
          id: newId,
          testType: fileToUpload.name.split('.')[0],
          date: currentDate,
          status: 'Completed',
          attachment: URL.createObjectURL(fileToUpload),
          orderedBy: 'Uploaded by User'
        };
        
        setPatients(prev => prev.map(patient => 
          patient.id === selectedPatient.id 
            ? { ...patient, labTests: [...patient.labTests, newLabReport] } 
            : patient
        ));
        break;
        
      case 'imaging':
        const newImageReport = {
          id: newId,
          type: fileToUpload.name.split('.')[0],
          date: currentDate,
          status: 'Completed',
          image: URL.createObjectURL(fileToUpload),
          orderedBy: 'Uploaded by User'
        };
        
        setPatients(prev => prev.map(patient => 
          patient.id === selectedPatient.id 
            ? { ...patient, imaging: [...patient.imaging, newImageReport] } 
            : patient
        ));
        break;
        
      default:
        break;
    }
    
    setFileToUpload(null);
    setShowUploadModal(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 w-full max-w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-6 sm:mb-4">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="relative">
            <FaClipboardList className="text-3xl sm:text-4xl text-blue-600" aria-hidden="true" />
            <MdOutlineMedicalServices className="absolute -bottom-1 -right-1 text-lg sm:text-xl bg-white rounded-full p-1 text-blue-600 border-2 border-blue-600" />
          </div>
          <h2 className=" text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 flex items-center">
            Medical Records
            <span className="ml-2 text-xs sm:text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {patients.length} total
            </span>
          </h2>
        </div>
      </div>

      {/* Search and Patient Selector Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 lg:mb-6 sm:mb-4">
        <div className="flex justify-between items-center mb-4 lg:mb-4 sm:mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <FaSearch className="mr-2 text-blue-600" />
            Patient Search
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              aria-label="Select search type"
            >
              <option value="name">Name</option>
              <option value="id">MRN/ID</option>
            </select>
            <div className="relative w-full sm:w-2/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm sm:text-base" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-full w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                placeholder={`Search by ${searchType === 'name' ? 'patient name' : 'MRN/ID'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search patients"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              aria-label="Filter by department"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="relative w-full sm:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-500 text-sm sm:text-base" />
              </div>
              <input
                type="date"
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                aria-label="Filter by date"
              />
            </div>
          </div>
        </div>

        {/* Patient List */}
        {filteredPatients.length > 0 ? (
          <div className="mt-6 lg:mt-6 sm:mt-4">
            <div className="hidden sm:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">MRN</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider lg:table-cell">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider lg:table-cell">Last Visit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className={`hover:bg-gray-100 cursor-pointer ${selectedPatient?.id === patient.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                            {patient.profilePic ? (
                              <img 
                                src={patient.profilePic} 
                                alt={patient.name} 
                                className="h-full w-full rounded-full"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/80';
                                }}
                              />
                            ) : (
                              <AiOutlineUser className="h-4 w-4" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="font-semibold text-gray-900 text-sm">{patient.name}</div>
                            <div className="text-xs text-gray-600">{patient.age} yrs, {patient.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{patient.id}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 lg:table-cell">{patient.department}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 lg:table-cell">{patient.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="block sm:hidden flex flex-col gap-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-3 rounded-lg cursor-pointer border border-gray-200 bg-gray-50 hover:shadow-md ${selectedPatient?.id === patient.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                      {patient.profilePic ? (
                        <img 
                          src={patient.profilePic} 
                          alt={patient.name} 
                          className="h-full w-full rounded-full"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80';
                          }}
                        />
                      ) : (
                        <AiOutlineUser className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 truncate">{patient.name}</div>
                      <div className="text-xs text-gray-600">{patient.age} yrs, {patient.gender}</div>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-600 grid grid-cols-2 gap-1">
                    <div className="truncate">MRN: {patient.id}</div>
                    <div className="truncate">Dept: {patient.department}</div>
                    <div className="truncate col-span-2">Last Visit: {patient.lastVisit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No patients found matching your search criteria</p>
            <button
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('all');
                setDateFilter('');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {selectedPatient && (
        <>
          {/* Patient Info Summary Card */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 lg:mb-6 sm:mb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <img
                className="h-20 w-20 rounded-full border-4 border-blue-100 mb-4 sm:mb-0 sm:mr-4"
                src={selectedPatient.profilePic}
                alt={selectedPatient.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/80';
                }}
              />
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-gray-600 text-sm">{selectedPatient.age} years, {selectedPatient.gender}</p>
                  <p className="mt-2 text-xs text-gray-600 flex items-center justify-center sm:justify-start">
                    <FaIdCard className="mr-2 text-blue-600" />
                    <span className="font-semibold">MRN:</span> {selectedPatient.id}
                  </p>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-gray-600 text-sm flex items-center justify-center sm:justify-start">
                    <FaPhone className="mr-2 text-blue-600" />
                    {selectedPatient.contact}
                  </p>
                  <p className="mt-2 text-xs text-gray-600 flex items-center justify-center sm:justify-start">
                    <FaHeartbeat className="mr-2 text-blue-600" />
                    <span className="font-semibold">Blood Group:</span> {selectedPatient.bloodGroup}
                  </p>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs text-gray-600 flex items-center justify-center sm:justify-start">
                    <FaCalendarAlt className="mr-2 text-blue-600" />
                    <span className="font-semibold">Last Visit:</span> {selectedPatient.lastVisit}
                  </p>
                  <p className="mt-2 text-xs text-gray-600 flex items-center justify-center sm:justify-start">
                    <MdOutlineMedicalServices className="mr-2 text-blue-600" />
                    <span className="font-semibold">Department:</span> {selectedPatient.department}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Records Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-6 lg:mb-6 sm:mb-4">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex lg:flex-row sm:flex-col flex-col">
                {[
                  { tab: 'visits', icon: FaClipboardList, label: 'Visits' },
                  { tab: 'prescriptions', icon: FaPills, label: 'Prescriptions' },
                  { tab: 'labTests', icon: FaVial, label: 'Lab Tests' },
                  { tab: 'imaging', icon: AiFillFileImage, label: 'Imaging' },
                  { tab: 'surgeries', icon: GiScalpel, label: 'Surgeries' },
                  { tab: 'conditions', icon: FaHeartbeat, label: 'Conditions' },
                ].map(({ tab, icon: Icon, label }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-xs sm:text-sm font-medium flex items-center ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Icon className="mr-1 sm:mr-2" /> {label}
                    {selectedPatient[tab]?.length > 0 && (
                      <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        {selectedPatient[tab].length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tabs Content */}
            <div className="p-4 sm:p-6">
              {/* Visits Tab */}
              {activeTab === 'visits' && (
                <div>
                  <div className="flex justify-between items-center mb-4 lg:mb-4 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                      <FaClipboardList className="mr-2 text-blue-600" />
                      Visit Summaries
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSection('visits')}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        {expandedSections.visits ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button
                        onClick={() => {
                          setRecordType('visit');
                          setShowAddRecordModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  {expandedSections.visits && (
                    <div className="space-y-4">
                      {selectedPatient.visits.length > 0 ? (
                        selectedPatient.visits.map((visit) => (
                          <div key={visit.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row justify-between items-start">
                              <div className="mb-2 sm:mb-0">
                                <h4 className="font-semibold text-gray-900 text-sm flex items-center">
                                  <FaCalendarAlt className="mr-2 text-blue-600" />
                                  {visit.date} - {visit.doctor}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1 flex items-center">
                                  <FaStickyNote className="mr-2 text-blue-600" />
                                  <span className="font-semibold">Symptoms:</span> {visit.symptoms}
                                </p>
                                <p className="text-xs text-gray-600 flex items-center">
                                  <FaCheckCircle className="mr-2 text-blue-600" />
                                  <span className="font-semibold">Diagnosis:</span> {visit.diagnosis}
                                </p>
                                {visit.treatment && (
                                  <p className="text-xs text-gray-600 flex items-center">
                                    <FaPills className="mr-2 text-blue-600" />
                                    <span className="font-semibold">Treatment:</span> {visit.treatment}
                                  </p>
                                )}
                                {visit.notes && (
                                  <p className="text-xs text-gray-600 flex items-center">
                                    <FaStickyNote className="mr-2 text-blue-600" />
                                    <span className="font-semibold">Notes:</span> {visit.notes}
                                  </p>
                                )}
                              </div>
                              <div className="text-xs text-gray-600">
                                <p><span className="font-semibold">BP:</span> {visit.vitals.bp}</p>
                                <p><span className="font-semibold">Temp:</span> {visit.vitals.temp}</p>
                                <p><span className="font-semibold">Pulse:</span> {visit.vitals.pulse}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No visit records found for this patient
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Prescriptions Tab */}
              {activeTab === 'prescriptions' && (
                <div>
                  <div className="flex justify-between items-center mb-4 lg:mb-4 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                      <FaPills className="mr-2 text-blue-600" />
                      Prescriptions
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSection('prescriptions')}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        {expandedSections.prescriptions ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button
                        onClick={() => {
                          setRecordType('prescription');
                          setShowAddRecordModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  {expandedSections.prescriptions && (
                    <div>
                      {selectedPatient.prescriptions.length > 0 ? (
                        <>
                          <div className="hidden sm:block">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Medicine</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Dosage</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider lg:table-cell">Frequency</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider lg:table-cell">Prescribed By</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider lg:table-cell">Status</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {selectedPatient.prescriptions.map((rx) => (
                                  <tr key={rx.id} className="hover:bg-gray-100">
                                    <td className="px-4 py-3 font-semibold text-gray-900 text-xs">{rx.medicine}</td>
                                    <td className="px-4 py-3 text-xs text-gray-600">{rx.dosage}</td>
                                    <td className="px-4 py-3 text-xs text-gray-600 lg:table-cell">{rx.frequency}</td>
                                    <td className="px-4 py-3 text-xs text-gray-600 lg:table-cell">{rx.doctor}</td>
                                    <td className="px-4 py-3 text-xs text-gray-600 lg:table-cell">
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        rx.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                        rx.status === 'Expired' ? 'bg-red-100 text-red-800' : 
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {rx.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="block sm:hidden flex flex-col gap-3">
                            {selectedPatient.prescriptions.map((rx) => (
                              <div key={rx.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:shadow-md">
                                <div className="text-xs text-gray-600">
                                  <p className="font-semibold truncate">{rx.medicine} <span className={`ml-2 px-1.5 py-0.5 rounded-full ${
                                    rx.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                    rx.status === 'Expired' ? 'bg-red-100 text-red-800' : 
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {rx.status}
                                  </span></p>
                                  <p className="truncate"><span className="font-semibold">Dosage:</span> {rx.dosage}</p>
                                  <p className="truncate"><span className="font-semibold">Frequency:</span> {rx.frequency}</p>
                                  <p className="truncate"><span className="font-semibold">By:</span> {rx.doctor}</p>
                                  <p className="truncate"><span className="font-semibold">Date:</span> {rx.date}</p>
                                  {rx.refills > 0 && (
                                    <p className="truncate"><span className="font-semibold">Refills:</span> {rx.refills}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No prescription records found for this patient
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Lab Tests Tab */}
              {activeTab === 'labTests' && (
                <div>
                  <div className="flex justify-between items-center mb-4 lg:mb-4 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                      <FaVial className="mr-2 text-blue-600" />
                      Lab Tests
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSection('labTests')}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        {expandedSections.labTests ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button
                        onClick={() => {
                          setRecordType('labTest');
                          setShowAddRecordModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FaPlus />
                      </button>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FaFileUpload />
                      </button>
                    </div>
                  </div>
                  {expandedSections.labTests && (
                    <div className="space-y-4">
                      {selectedPatient.labTests.length > 0 ? (
                        selectedPatient.labTests.map((test) => (
                          <div key={test.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row justify-between items-start">
                              <div className="mb-2 sm:mb-0">
                                <h4 className="font-semibold text-gray-900 text-sm flex items-center">
                                  <FaVial className="mr-2 text-blue-600" />
                                  {test.testType}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1 flex items-center">
                                  <FaCalendarAlt className="mr-2 text-blue-600" />
                                  <span className="font-semibold">Date:</span> {test.date}
                                </p>
                                <p className="text-xs text-gray-600 flex items-center">
                                  <FaCheckCircle className="mr-2 text-blue-600" />
                                  <span className="font-semibold">Status:</span> 
                                  <span className={`ml-1 px-1.5 py-0.5 rounded-full ${
                                    test.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                    test.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {test.status}
                                  </span>
                                </p>
                                <p className="text-xs text-gray-600 flex items-center">
                                  <FaUser className="mr-2 text-blue-600" />
                                  <span className="font-semibold">Ordered By:</span> {test.orderedBy}
                                </p>
                                {test.results && (
                                  <p className="text-xs text-gray-600 flex items-start">
                                    <FaStickyNote className="mr-2 text-blue-600 mt-0.5" />
                                    <span className="font-semibold">Results:</span> {test.results}
                                  </p>
                                )}
                                {test.interpretation && (
                                  <p className="text-xs text-gray-600 flex items-start">
                                    <FaCheckCircle className="mr-2 text-blue-600 mt-0.5" />
                                    <span className="font-semibold">Interpretation:</span> {test.interpretation}
                                  </p>
                                )}
                              </div>
                              {test.attachment && (
                                <a
                                  href={test.attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-900 flex items-center text-xs transition-colors"
                                >
                                  <FaFilePdf className="mr-1" /> View Report
                                </a>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No lab test records found for this patient
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Imaging Tab */}
              {activeTab === 'imaging' && (
                <div>
                  <div className="flex justify-between items-center mb-4 lg:mb-4 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                      <AiFillFileImage className="mr-2 text-blue-600" />
                      Imaging Reports
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSection('imaging')}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        {expandedSections.imaging ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button
                        onClick={() => {
                          setRecordType('imaging');
                          setShowAddRecordModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FaPlus />
                      </button>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FaFileUpload />
                      </button>
                    </div>
                  </div>
                  {expandedSections.imaging && (
                    <div className="grid grid-cols-1 gap-4">
                      {selectedPatient.imaging.length > 0 ? (
                        selectedPatient.imaging.map((image) => (
                          <div key={image.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm flex items-center">
                                <AiFillFileImage className="mr-2 text-blue-600" />
                                {image.type}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">{image.date}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  image.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                  image.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {image.status}
                                </span>
                              </div>
                            </div>
                            <div className="bg-gray-100 rounded-md p-2 mb-2">
                              <img
                                src={image.image}
                                alt={image.type}
                                className="w-full h-auto rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(image.image, '_blank')}
                              />
                            </div>
                            <div className="text-xs text-gray-600">
                              <p className="flex items-start">
                                <FaUser className="mr-2 mt-0.5" />
                                <span className="font-semibold">Ordered By:</span> {image.orderedBy}
                              </p>
                              <p className="flex items-start mt-1">
                                <FaStickyNote className="mr-2 mt-0.5" />
                                <span className="font-semibold">Remarks:</span> {image.remarks}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No imaging records found for this patient
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Surgeries Tab */}
              {activeTab === 'surgeries' && (
                <div>
                  <div className="flex justify-between items-center mb-4 lg:mb-4 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                      <GiScalpel className="mr-2 text-blue-600" />
                      Surgical History
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSection('surgeries')}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        {expandedSections.surgeries ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button
                        onClick={() => {
                          setRecordType('surgery');
                          setShowAddRecordModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  {expandedSections.surgeries && (
                    <div className="space-y-4">
                      {selectedPatient.surgeries.length > 0 ? (
                        selectedPatient.surgeries.map((surgery) => (
                          <div key={surgery.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all">
                            <div className="mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm flex items-center">
                                <GiScalpel className="mr-2 text-blue-600" />
                                {surgery.procedure}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 flex items-center">
                                <FaCalendarAlt className="mr-2 text-blue-600" />
                                <span className="font-semibold">Date:</span> {surgery.date}
                              </p>
                              <p className="text-xs text-gray-600 flex items-center">
                                <AiOutlineUser className="mr-2 text-blue-600" />
                                <span className="font-semibold">Surgeon:</span> {surgery.surgeon}
                              </p>
                              <p className="text-xs text-gray-600 flex items-center">
                                <MdOutlineMedicalServices className="mr-2 text-blue-600" />
                                <span className="font-semibold">Facility:</span> {surgery.facility}
                              </p>
                              <p className="text-xs text-gray-600 flex items-center">
                                <FaCheckCircle className="mr-2 text-blue-600" />
                                <span className="font-semibold">Outcome:</span> 
                                <span className={`ml-1 px-1.5 py-0.5 rounded-full ${
                                  surgery.outcome === 'Successful' ? 'bg-green-100 text-green-800' : 
                                  surgery.outcome === 'Complicated' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {surgery.outcome}
                                </span>
                              </p>
                              {surgery.anesthesia && (
                                <p className="text-xs text-gray-600 flex items-center">
                                  <FaPills className="mr-2 text-blue-600" />
                                  <span className="font-semibold">Anesthesia:</span> {surgery.anesthesia}
                                </p>
                              )}
                              {surgery.duration && (
                                <p className="text-xs text-gray-600 flex items-center">
                                  <FaClock className="mr-2 text-blue-600" />
                                  <span className="font-semibold">Duration:</span> {surgery.duration}
                                </p>
                              )}
                              {surgery.followUp && (
                                <p className="text-xs text-gray-600 flex items-center">
                                  <FaCalendarAlt className="mr-2 text-blue-600" />
                                  <span className="font-semibold">Follow-up:</span> {surgery.followUp}
                                </p>
                              )}
                            </div>
                            {surgery.notes && (
                              <div className="p-3 bg-gray-100 rounded-md">
                                <p className="text-xs text-gray-600 flex items-start">
                                  <FaStickyNote className="mr-2 mt-0.5 text-blue-600" />
                                  {surgery.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No surgical records found for this patient
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Conditions Tab */}
              {activeTab === 'conditions' && (
                <div>
                  <div className="flex justify-between items-center mb-4 lg:mb-4 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                      <FaHeartbeat className="mr-2 text-blue-600" />
                      Chronic Conditions & Allergies
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSection('conditions')}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        {expandedSections.conditions ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button
                        onClick={() => {
                          setRecordType('condition');
                          setShowAddRecordModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  {expandedSections.conditions && (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                          <FaHeartbeat className="mr-2 text-red-600" />
                          Chronic Conditions
                        </h4>
                        <div className="space-y-2">
                          {selectedPatient.conditions.filter(c => !c.type.includes('Allergy')).length > 0 ? (
                            selectedPatient.conditions.filter(c => !c.type.includes('Allergy')).map((condition) => (
                              <div key={condition.id} className="flex items-start">
                                <div className="h-4 w-4 text-red-600 mt-0.5">
                                  <FaHeartbeat />
                                </div>
                                <div className="ml-2">
                                  <p className="text-xs font-semibold text-gray-900">{condition.type}</p>
                                  <div className="text-xs text-gray-600">
                                    {condition.since && <p>Since: {condition.since}</p>}
                                    {condition.status && <p>Status: {condition.status}</p>}
                                    {condition.severity && <p>Severity: {condition.severity}</p>}
                                    {condition.notes && <p>Notes: {condition.notes}</p>}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-2 text-gray-500 text-xs">
                              No chronic conditions recorded
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                          <FaAllergies className="mr-2 text-yellow-600" />
                          Allergies
                        </h4>
                        <div className="space-y-2">
                          {selectedPatient.conditions.filter(c => c.type.includes('Allergy')).length > 0 ? (
                            selectedPatient.conditions.filter(c => c.type.includes('Allergy')).map((allergy) => (
                              <div key={allergy.id} className="flex items-start">
                                <div className="h-4 w-4 text-yellow-600 mt-0.5">
                                  <FaAllergies />
                                </div>
                                <div className="ml-2">
                                  <p className="text-xs font-semibold text-gray-900">{allergy.type}</p>
                                  <div className="text-xs text-gray-600">
                                    {allergy.severity && <p>Severity: {allergy.severity}</p>}
                                    {allergy.reaction && <p>Reaction: {allergy.reaction}</p>}
                                    {allergy.notes && <p>Notes: {allergy.notes}</p>}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-2 text-gray-500 text-xs">
                              No allergies recorded
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 lg:mb-4 sm:mb-3 flex items-center">
              <MdOutlineMedicalServices className="mr-2 text-blue-600" />
              Medical Records Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-blue-500 transition-all text-sm"
                onClick={() => {
                  setRecordType(activeTab === 'visits' ? 'visit' : 
                               activeTab === 'prescriptions' ? 'prescription' : 
                               activeTab === 'labTests' ? 'labTest' : 
                               activeTab === 'imaging' ? 'imaging' : 
                               activeTab === 'surgeries' ? 'surgery' : 'condition');
                  setShowAddRecordModal(true);
                }}
              >
                <FaEdit className="mr-2" /> Add New Record
              </button>
              {(activeTab === 'labTests' || activeTab === 'imaging') && (
                <button 
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-green-500 transition-all text-sm"
                  onClick={() => setShowUploadModal(true)}
                >
                  <FaFileUpload className="mr-2" /> Upload Report
                </button>
              )}
              <button 
                className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-purple-500 transition-all text-sm"
                onClick={handleExportPDF}
              >
                <FaFilePdf className="mr-2" /> Export to PDF
              </button>
              <button 
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-gray-500 transition-all text-sm"
                onClick={handleShareWithDoctor}
              >
                <FaShare className="mr-2" /> Share with Doctor
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add Record Modal */}
      {showAddRecordModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New {recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record
              </h3>
              <button
                onClick={() => setShowAddRecordModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmitRecord}>
              {recordType === 'visit' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={visitForm.date}
                        onChange={(e) => handleInputChange(e, 'visit')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                      <input
                        type="text"
                        name="doctor"
                        value={visitForm.doctor}
                        onChange={(e) => handleInputChange(e, 'visit')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                    <textarea
                      name="symptoms"
                      value={visitForm.symptoms}
                      onChange={(e) => handleInputChange(e, 'visit')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                    <input
                      type="text"
                      name="diagnosis"
                      value={visitForm.diagnosis}
                      onChange={(e) => handleInputChange(e, 'visit')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                    <textarea
                      name="treatment"
                      value={visitForm.treatment}
                      onChange={(e) => handleInputChange(e, 'visit')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={visitForm.notes}
                      onChange={(e) => handleInputChange(e, 'visit')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                      <input
                        type="text"
                        name="vitals.bp"
                        value={visitForm.vitals.bp}
                        onChange={(e) => handleInputChange(e, 'visit')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="120/80"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                      <input
                        type="text"
                        name="vitals.temp"
                        value={visitForm.vitals.temp}
                        onChange={(e) => handleInputChange(e, 'visit')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="98.6°F"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pulse</label>
                      <input
                        type="text"
                        name="vitals.pulse"
                        value={visitForm.vitals.pulse}
                        onChange={(e) => handleInputChange(e, 'visit')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="72 bpm"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {recordType === 'prescription' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medicine</label>
                      <input
                        type="text"
                        name="medicine"
                        value={prescriptionForm.medicine}
                        onChange={(e) => handleInputChange(e, 'prescription')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                      <input
                        type="text"
                        name="dosage"
                        value={prescriptionForm.dosage}
                        onChange={(e) => handleInputChange(e, 'prescription')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                      <input
                        type="text"
                        name="frequency"
                        value={prescriptionForm.frequency}
                        onChange={(e) => handleInputChange(e, 'prescription')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={prescriptionForm.duration}
                        onChange={(e) => handleInputChange(e, 'prescription')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                      <input
                        type="text"
                        name="doctor"
                        value={prescriptionForm.doctor}
                        onChange={(e) => handleInputChange(e, 'prescription')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={prescriptionForm.date}
                        onChange={(e) => handleInputChange(e, 'prescription')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={prescriptionForm.status}
                        onChange={(e) => handleInputChange(e, 'prescription')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Refills</label>
                      <input
                        type="number"
                        name="refills"
                        value={prescriptionForm.refills}
                        onChange={(e) => handleInputChange(e, 'prescription')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {recordType === 'labTest' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                      <input
                        type="text"
                        name="testType"
                        value={labTestForm.testType}
                        onChange={(e) => handleInputChange(e, 'labTest')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={labTestForm.date}
                        onChange={(e) => handleInputChange(e, 'labTest')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordered By</label>
                    <input
                      type="text"
                      name="orderedBy"
                      value={labTestForm.orderedBy}
                      onChange={(e) => handleInputChange(e, 'labTest')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={labTestForm.status}
                      onChange={(e) => handleInputChange(e, 'labTest')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              )}
              
              {recordType === 'imaging' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <input
                        type="text"
                        name="type"
                        value={imagingForm.type}
                        onChange={(e) => handleInputChange(e, 'imaging')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={imagingForm.date}
                        onChange={(e) => handleInputChange(e, 'imaging')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordered By</label>
                    <input
                      type="text"
                      name="orderedBy"
                      value={imagingForm.orderedBy}
                      onChange={(e) => handleInputChange(e, 'imaging')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={imagingForm.status}
                      onChange={(e) => handleInputChange(e, 'imaging')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea
                      name="remarks"
                      value={imagingForm.remarks}
                      onChange={(e) => handleInputChange(e, 'imaging')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
              
              {recordType === 'surgery' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Procedure</label>
                      <input
                        type="text"
                        name="procedure"
                        value={surgeryForm.procedure}
                        onChange={(e) => handleInputChange(e, 'surgery')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={surgeryForm.date}
                        onChange={(e) => handleInputChange(e, 'surgery')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Surgeon</label>
                      <input
                        type="text"
                        name="surgeon"
                        value={surgeryForm.surgeon}
                        onChange={(e) => handleInputChange(e, 'surgery')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facility</label>
                      <input
                        type="text"
                        name="facility"
                        value={surgeryForm.facility}
                        onChange={(e) => handleInputChange(e, 'surgery')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Anesthesia</label>
                      <input
                        type="text"
                        name="anesthesia"
                        value={surgeryForm.anesthesia}
                        onChange={(e) => handleInputChange(e, 'surgery')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={surgeryForm.duration}
                        onChange={(e) => handleInputChange(e, 'surgery')}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                    <select
                      name="outcome"
                      value={surgeryForm.outcome}
                      onChange={(e) => handleInputChange(e, 'surgery')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Successful">Successful</option>
                      <option value="Complicated">Complicated</option>
                      <option value="Unsuccessful">Unsuccessful</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      name="followUp"
                      value={surgeryForm.followUp}
                      onChange={(e) => handleInputChange(e, 'surgery')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={surgeryForm.notes}
                      onChange={(e) => handleInputChange(e, 'surgery')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      rows={3}
                    />
                  </div>
                </div>
              )}
              
              {recordType === 'condition' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={conditionForm.category}
                      onChange={(e) => handleInputChange(e, 'condition')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="condition">Chronic Condition</option>
                      <option value="allergy">Allergy</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {conditionForm.category === 'condition' ? 'Condition' : 'Allergy'}
                    </label>
                    <input
                      type="text"
                      name="type"
                      value={conditionForm.type}
                      onChange={(e) => handleInputChange(e, 'condition')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  {conditionForm.category === 'condition' ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Since</label>
                          <input
                            type="text"
                            name="since"
                            value={conditionForm.since}
                            onChange={(e) => handleInputChange(e, 'condition')}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Year or date"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <input
                            type="text"
                            name="status"
                            value={conditionForm.status}
                            onChange={(e) => handleInputChange(e, 'condition')}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="e.g. Controlled, Managed"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                        <input
                          type="text"
                          name="severity"
                          value={conditionForm.severity}
                          onChange={(e) => handleInputChange(e, 'condition')}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="e.g. Mild, Moderate, Severe"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                        <select
                          name="severity"
                          value={conditionForm.severity}
                          onChange={(e) => handleInputChange(e, 'condition')}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">Select severity</option>
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Severe">Severe</option>
                          <option value="Life-threatening">Life-threatening</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reaction</label>
                        <input
                          type="text"
                          name="reaction"
                          value={conditionForm.reaction}
                          onChange={(e) => handleInputChange(e, 'condition')}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="e.g. Hives, Anaphylaxis"
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={conditionForm.notes}
                      onChange={(e) => handleInputChange(e, 'condition')}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      rows={2}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Report Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload {activeTab === 'labTests' ? 'Lab Report' : 'Imaging'}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleUploadReport}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {activeTab === 'labTests' ? 'Lab Report' : 'Imaging'} File
                  </label>
                  <input
                    type="file"
                    accept={activeTab === 'labTests' ? '.pdf,.doc,.docx' : 'image/*'}
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                {fileToUpload && (
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Selected file: <span className="font-medium">{fileToUpload.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {(fileToUpload.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={!fileToUpload}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;