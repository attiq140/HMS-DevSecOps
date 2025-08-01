import React, { useState, useEffect, useCallback } from 'react';
import {
  FaSearch, FaPlus, FaEye, FaPrint, FaClipboardList, FaPills,
  FaStickyNote, FaSignature, FaTimes, FaPrescriptionBottleAlt,
  FaUser, FaCalendarAlt, FaChevronDown, FaChevronUp,
  FaSpinner, FaExclamationCircle
} from 'react-icons/fa';
import Autosuggest from 'react-autosuggest';
import { MdOutlineMedicalServices } from 'react-icons/md';

const PrescriptionSection = () => {
  // State for dynamic sections
  const [expandedSections, setExpandedSections] = useState({
    newPrescription: true,
    history: true,
  });

  // Data states with loading and error handling
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState({
    patients: false,
    prescriptions: false,
    form: false,
  });
  const [errors, setErrors] = useState({
    patients: null,
    prescriptions: null,
    form: {},
  });

  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    notes: '',
  });

  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [viewPrescription, setViewPrescription] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Medicine suggestions
  const medicineSuggestions = [
    'Atorvastatin', 'Sumatriptan', 'Metformin', 'Amlodipine', 'Ibuprofen',
    'Amoxicillin', 'Lisinopril', 'Omeprazole', 'Levothyroxine', 'Gabapentin',
    'Aspirin', 'Paracetamol', 'Simvastatin', 'Losartan', 'Hydrochlorothiazide'
  ];

  // Fetch data
  useEffect(() => {
    let isMounted = true;
    
    const fetchPatients = async () => {
      if (!isMounted) return;
      setIsLoading(prev => ({ ...prev, patients: true }));
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockPatients = [
          { 
            id: 'MRN-001', 
            name: 'John Smith', 
            age: 45, 
            gender: 'Male', 
            contact: '+1 555-123-4567',
            lastVisit: '2023-05-15',
            department: 'Cardiology',
            profilePic: 'https://randomuser.me/api/portraits/men/1.jpg'
          },
          { 
            id: 'MRN-002', 
            name: 'Jane Doe', 
            age: 32, 
            gender: 'Female', 
            contact: '+1 555-987-6543',
            lastVisit: '2023-06-10',
            department: 'Neurology',
            profilePic: 'https://randomuser.me/api/portraits/women/2.jpg'
          },
        ];
        if (isMounted) {
          setPatients(mockPatients);
          setErrors(prev => ({ ...prev, patients: null }));
        }
      } catch (err) {
        if (isMounted) setErrors(prev => ({ ...prev, patients: 'Failed to load patients' }));
      } finally {
        if (isMounted) setIsLoading(prev => ({ ...prev, patients: false }));
      }
    };

    const fetchPrescriptions = async () => {
      if (!isMounted) return;
      setIsLoading(prev => ({ ...prev, prescriptions: true }));
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockPrescriptions = [
          {
            id: 'RX-001',
            patientId: 'MRN-001',
            date: '2023-05-15',
            diagnosis: 'Angina',
            medications: [
              { name: 'Atorvastatin', dosage: '40 mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with food' },
              { name: 'Aspirin', dosage: '81 mg', frequency: 'Once daily', duration: 'Indefinite', instructions: 'Take with water' }
            ],
            notes: 'Monitor cholesterol levels. Follow up in 4 weeks.',
            doctor: { name: 'Dr. Sarah Johnson', signature: 'Sarah Johnson, MD' },
            status: 'active'
          },
          {
            id: 'RX-002',
            patientId: 'MRN-002',
            date: '2023-06-10',
            diagnosis: 'Migraine',
            medications: [
              { name: 'Sumatriptan', dosage: '50 mg', frequency: 'As needed', duration: '10 days', instructions: 'Take at onset of migraine' },
            ],
            notes: 'Avoid triggers like caffeine and stress. Keep a headache diary.',
            doctor: { name: 'Dr. Michael Chen', signature: 'Michael Chen, MD' },
            status: 'completed'
          },
        ];
        if (isMounted) {
          setPrescriptions(mockPrescriptions);
          setErrors(prev => ({ ...prev, prescriptions: null }));
        }
      } catch (err) {
        if (isMounted) setErrors(prev => ({ ...prev, prescriptions: 'Failed to load prescriptions' }));
      } finally {
        if (isMounted) setIsLoading(prev => ({ ...prev, prescriptions: false }));
      }
    };

    fetchPatients();
    fetchPrescriptions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helpers
  const getSuggestions = useCallback((value) => {
    const inputValue = value.trim().toLowerCase();
    return inputValue.length === 0
      ? []
      : medicineSuggestions.filter(med => med.toLowerCase().includes(inputValue));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = 'Please select a patient';
    if (!formData.diagnosis) newErrors.diagnosis = 'Diagnosis is required';
    formData.medications.forEach((med, index) => {
      if (!med.name) newErrors[`medName${index}`] = 'Medicine name is required';
      if (!med.dosage) newErrors[`medDosage${index}`] = 'Dosage is required';
      if (!med.frequency) newErrors[`medFrequency${index}`] = 'Frequency is required';
      if (!med.duration) newErrors[`medDuration${index}`] = 'Duration is required';
    });
    return newErrors;
  }, [formData]);

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors.form[field]) {
      setErrors(prev => ({
        ...prev,
        form: { ...prev.form, [field]: undefined }
      }));
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index][field] = value;
    setFormData(prev => ({ ...prev, medications: updatedMedications }));
    
    // Clear error when medication field is updated
    const errorKey = `med${field.charAt(0).toUpperCase() + field.slice(1)}${index}`;
    if (errors.form[errorKey]) {
      setErrors(prev => ({
        ...prev,
        form: { ...prev.form, [errorKey]: undefined }
      }));
    }
  };

  const handleAddMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }));
  };

  const handleRemoveMedication = (index) => {
    if (formData.medications.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, form: validationErrors }));
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, form: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPrescription = {
        id: `RX-${Date.now().toString().slice(-6)}`,
        patientId: formData.patientId,
        date: new Date().toISOString().split('T')[0],
        diagnosis: formData.diagnosis,
        medications: formData.medications,
        notes: formData.notes,
        doctor: { name: 'Dr. Sarah Johnson', signature: 'Sarah Johnson, MD' },
        status: 'active'
      };

      setPrescriptions(prev => [...prev, newPrescription]);
      resetForm();
      setSelectedPatient(null);
    } catch (err) {
      setErrors(prev => ({ ...prev, form: { submit: 'Failed to save prescription' } }));
    } finally {
      setIsLoading(prev => ({ ...prev, form: false }));
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      diagnosis: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      notes: ''
    });
    setSearchTerm('');
    setErrors(prev => ({ ...prev, form: {} }));
  };

  const handlePrint = (prescription) => {
    const patient = patients.find(p => p.id === prescription.patientId);
    const content = `
      ==== MEDICAL PRESCRIPTION ====
      
      Doctor: ${prescription.doctor.name}
      Signature: ${prescription.doctor.signature}
      Date: ${prescription.date}
      
      Patient: ${patient?.name || 'Unknown'} (${prescription.patientId})
      Age: ${patient?.age || 'N/A'}, Gender: ${patient?.gender || 'N/A'}
      
      Diagnosis: ${prescription.diagnosis}
      
      Medications:
      ${prescription.medications.map((m, i) => `
      ${i + 1}. ${m.name}
         - Dosage: ${m.dosage}
         - Frequency: ${m.frequency}
         - Duration: ${m.duration}
         - Instructions: ${m.instructions || 'None'}
      `).join('')}
      
      Notes: ${prescription.notes}
      
      ==== END OF PRESCRIPTION ====
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription_${prescription.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRePrescribe = (prescription) => {
    const patient = patients.find(p => p.id === prescription.patientId);
    setFormData({
      patientId: prescription.patientId,
      diagnosis: prescription.diagnosis,
      medications: prescription.medications,
      notes: prescription.notes
    });
    setSelectedPatient(patient);
    setExpandedSections(prev => ({ ...prev, newPrescription: true }));
    document.getElementById('new-prescription-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter prescriptions based on active tab
  const filteredPrescriptions = prescriptions.filter(prescription =>
    activeTab === 'current' ? prescription.status === 'active' : true
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="relative">
            <FaPills className="text-3xl sm:text-4xl text-blue-600" />
            <FaPrescriptionBottleAlt className="absolute -bottom-1 -right-1 text-lg sm:text-xl bg-white rounded-full p-1 text-blue-600 border-2 border-blue-600" />
          </div>
          <h2 className=" text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 flex items-center">
            Prescription Management
            <span className="ml-2 text-xs sm:text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {prescriptions.filter(p => p.status === 'active').length} active
            </span>
          </h2>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => toggleSection('newPrescription')}
            className={`  flex items-center px-3 py-2 rounded-lg text-sm  ${expandedSections.newPrescription ? 'bg-blue-100 text-blue-800'  : 'bg-gray-100 text-gray-800'}`}
          >
            {expandedSections.newPrescription ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />}
            New Prescription
          </button>
          <button
            onClick={() => toggleSection('history')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm ${expandedSections.history ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            {expandedSections.history ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />}
            Prescription History
          </button>
        </div>
      </div>

      {/* New Prescription Form */}
      <div className="bg-white rounded-xl shadow-lg transition-all duration-200">
        <div 
          className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('newPrescription')}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <FaClipboardList className="mr-2 text-blue-600" />
            New Prescription
          </h3>
          <button
            className="text-blue-600 hover:text-blue-900 transition-colors"
          >
            {expandedSections.newPrescription ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        
        {expandedSections.newPrescription && (
          <div className="p-4 sm:p-6">
            <form id="new-prescription-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Patient Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Patient</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    placeholder="Search patient by name or ID"
                    value={selectedPatient ? `${selectedPatient.name} (${selectedPatient.id})` : searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading.patients || selectedPatient}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {isLoading.patients ? (
                      <FaSpinner className="text-gray-400 text-sm animate-spin" />
                    ) : (
                      <FaSearch className="text-gray-400 text-sm" />
                    )}
                  </div>
                  {selectedPatient && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatient(null);
                        setSearchTerm('');
                        handleInputChange('patientId', '');
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
                {errors.patients && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.patients}
                  </p>
                )}
                
                {/* Patient Selection Dropdown */}
                {searchTerm && !selectedPatient && (
                  <div className="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map(patient => (
                        <div
                          key={patient.id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer ${formData.patientId === patient.id ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            handleInputChange('patientId', patient.id);
                            setSelectedPatient(patient);
                            setSearchTerm('');
                          }}
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full overflow-hidden mr-3">
                              {patient.profilePic ? (
                                <img 
                                  src={patient.profilePic} 
                                  alt={patient.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/80';
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-blue-600">
                                  <FaUser className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{patient.name}</p>
                              <p className="text-xs text-gray-600">MRN: {patient.id} • {patient.age} yrs • {patient.gender}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-gray-500">No patients found</div>
                    )}
                  </div>
                )}
                
                {errors.form.patientId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.form.patientId}
                  </p>
                )}
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Diagnosis</label>
                <textarea
                  className={`w-full p-3 border ${errors.form.diagnosis ? 'border-red-300' : 'border-gray-300'} rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm`}
                  value={formData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  rows={2}
                  placeholder="Enter diagnosis"
                />
                {errors.form.diagnosis && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.form.diagnosis}
                  </p>
                )}
              </div>

              {/* Medications */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Medications</h4>
                {formData.medications.map((med, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      disabled={formData.medications.length <= 1}
                    >
                      <FaTimes />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Medicine Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700">Medicine Name</label>
                        <Autosuggest
                          suggestions={suggestions}
                          onSuggestionsFetchRequested={({ value }) => setSuggestions(getSuggestions(value))}
                          onSuggestionsClearRequested={() => setSuggestions([])}
                          getSuggestionValue={suggestion => suggestion}
                          renderSuggestion={suggestion => <div className="p-2 hover:bg-gray-100">{suggestion}</div>}
                          inputProps={{
                            className: `w-full p-2 border ${errors.form[`medName${index}`] ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-700`,
                            value: med.name,
                            onChange: (e, { newValue }) => handleMedicationChange(index, 'name', newValue),
                            placeholder: "Enter medicine name",
                          }}
                          theme={{
                            container: 'relative',
                            suggestionsContainer: 'absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg',
                            suggestionsList: 'list-none p-0 m-0',
                            suggestion: 'cursor-pointer',
                          }}
                        />
                        {errors.form[`medName${index}`] && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <FaExclamationCircle className="mr-1" /> {errors.form[`medName${index}`]}
                          </p>
                        )}
                      </div>

                      {/* Dosage */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700">Dosage</label>
                        <input
                          type="text"
                          className={`w-full p-2 border ${errors.form[`medDosage${index}`] ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-700`}
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                          placeholder="e.g. 40 mg"
                        />
                        {errors.form[`medDosage${index}`] && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <FaExclamationCircle className="mr-1" /> {errors.form[`medDosage${index}`]}
                          </p>
                        )}
                      </div>

                      {/* Frequency */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700">Frequency</label>
                        <input
                          type="text"
                          className={`w-full p-2 border ${errors.form[`medFrequency${index}`] ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-700`}
                          value={med.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                          placeholder="e.g. Once daily"
                        />
                        {errors.form[`medFrequency${index}`] && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <FaExclamationCircle className="mr-1" /> {errors.form[`medFrequency${index}`]}
                          </p>
                        )}
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700">Duration</label>
                        <input
                          type="text"
                          className={`w-full p-2 border ${errors.form[`medDuration${index}`] ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-700`}
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                          placeholder="e.g. 30 days"
                        />
                        {errors.form[`medDuration${index}`] && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <FaExclamationCircle className="mr-1" /> {errors.form[`medDuration${index}`]}
                          </p>
                        )}
                      </div>

                      {/* Instructions */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700">Instructions</label>
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                          value={med.instructions}
                          onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                          placeholder="Special instructions"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  <FaPlus className="mr-2" />
                  Add More Medication
                </button>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes for the patient"
                  rows={3}
                />
              </div>

              {/* Form Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="submit"
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm disabled:opacity-70"
                  disabled={isLoading.form}
                >
                  {isLoading.form ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaClipboardList className="mr-2" />
                      Save Prescription
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all text-sm"
                >
                  <FaTimes className="mr-2" />
                  Reset Form
                </button>
              </div>
              {errors.form.submit && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <FaExclamationCircle className="mr-2" /> {errors.form.submit}
                </p>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Prescription History */}
      <div className="bg-white rounded-xl shadow-lg transition-all duration-200">
        <div 
          className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('history')}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <FaClipboardList className="mr-2 text-blue-600" />
            Prescription History
          </h3>
          <button
            className="text-blue-600 hover:text-blue-900 transition-colors"
          >
            {expandedSections.history ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        
        {expandedSections.history && (
          <div className="p-4 sm:p-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'current' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('current')}
              >
                Current Prescriptions
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('history')}
              >
                All History
              </button>
            </div>

            {isLoading.prescriptions ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-blue-600 text-2xl mr-3" />
                <span>Loading prescriptions...</span>
              </div>
            ) : errors.prescriptions ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
                <FaExclamationCircle className="mr-2" />
                {errors.prescriptions}
              </div>
            ) : filteredPrescriptions.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Patient</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Diagnosis</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Medications</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPrescriptions.map(prescription => {
                        const patient = patients.find(p => p.id === prescription.patientId);
                        return (
                          <tr key={prescription.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="h-8 w-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                                  {patient?.profilePic ? (
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
                                    <FaUser className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="ml-3">
                                  <div className="font-semibold text-gray-900 text-sm">{patient?.name || 'Unknown'}</div>
                                  <div className="text-xs text-gray-600">{patient?.id || ''}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">
                              <div className="flex items-center">
                                <FaCalendarAlt className="mr-2 text-blue-600" />
                                {prescription.date}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">{prescription.diagnosis}</td>
                            <td className="px-4 py-3 text-xs text-gray-600">
                              {prescription.medications.map(m => `${m.name} (${m.dosage})`).join(', ')}
                            </td>
                            <td className="px-4 py-3 text-xs">
                              <span className={`px-2 py-1 rounded-full ${prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {prescription.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setViewPrescription(prescription)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                                  title="View Details"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  onClick={() => handleRePrescribe(prescription)}
                                  className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                                  title="Re-prescribe"
                                >
                                  <FaClipboardList />
                                </button>
                                <button
                                  onClick={() => handlePrint(prescription)}
                                  className="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-purple-50"
                                  title="Print/Download"
                                >
                                  <FaPrint />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3">
                  {filteredPrescriptions.map(prescription => {
                    const patient = patients.find(p => p.id === prescription.patientId);
                    return (
                      <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 mr-2">
                              {patient?.profilePic ? (
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
                                <FaUser className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">{patient?.name || 'Unknown'}</h4>
                              <p className="text-xs text-gray-600">{patient?.id || ''}</p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setViewPrescription(prescription)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleRePrescribe(prescription)}
                              className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                              title="Re-prescribe"
                            >
                              <FaClipboardList />
                            </button>
                            <button
                              onClick={() => handlePrint(prescription)}
                              className="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-purple-50"
                              title="Print/Download"
                            >
                              <FaPrint />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1 text-blue-600" />
                            <span>{prescription.date}</span>
                          </div>
                          <div>
                            <span className="font-semibold">Status:</span> 
                            <span className={`ml-1 px-1 rounded ${prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {prescription.status}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Diagnosis:</span> {prescription.diagnosis}
                          </div>
                          <div className="col-span-2">
                            <span className="font-semibold">Medications:</span> {prescription.medications.map(m => `${m.name} (${m.dosage})`).join(', ')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No prescriptions found for this filter
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prescription View Modal */}
      {viewPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaClipboardList className="mr-2 text-blue-600" />
                Prescription Details
              </h3>
              <button
                onClick={() => setViewPrescription(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    Patient Information
                  </h4>
                  {(() => {
                    const patient = patients.find(p => p.id === viewPrescription.patientId);
                    return (
                      <>
                        <p className="text-sm text-gray-900 font-medium">{patient?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-600">MRN: {viewPrescription.patientId}</p>
                        {patient && (
                          <>
                            <p className="text-xs text-gray-600">{patient.age} years, {patient.gender}</p>
                            <p className="text-xs text-gray-600">{patient.contact}</p>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <MdOutlineMedicalServices className="mr-2 text-blue-600" />
                    Doctor Information
                  </h4>
                  <p className="text-sm text-gray-900 font-medium">{viewPrescription.doctor.name}</p>
                  <p className="text-xs text-gray-600 flex items-center">
                    <FaSignature className="mr-2 text-blue-600" />
                    {viewPrescription.doctor.signature}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-600" />
                    Date: {viewPrescription.date}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaStickyNote className="mr-2 text-blue-600" />
                  Diagnosis
                </h4>
                <p className="text-sm text-gray-900">{viewPrescription.diagnosis}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaPills className="mr-2 text-blue-600" />
                  Medications
                </h4>
                <div className="space-y-3">
                  {viewPrescription.medications.map((med, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-3">
                      <p className="text-sm font-medium text-gray-900">{med.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-1">
                        <div><span className="font-semibold">Dosage:</span> {med.dosage}</div>
                        <div><span className="font-semibold">Frequency:</span> {med.frequency}</div>
                        <div><span className="font-semibold">Duration:</span> {med.duration}</div>
                        {med.instructions && (
                          <div className="col-span-2">
                            <span className="font-semibold">Instructions:</span> {med.instructions}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {viewPrescription.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FaStickyNote className="mr-2 text-blue-600" />
                    Additional Notes
                  </h4>
                  <p className="text-sm text-gray-900 whitespace-pre-line">{viewPrescription.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handlePrint(viewPrescription)}
                  className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                >
                  <FaPrint className="mr-2" />
                  Print / Download
                </button>
                <button
                  onClick={() => {
                    handleRePrescribe(viewPrescription);
                    setViewPrescription(null);
                  }}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                >
                  <FaClipboardList className="mr-2" />
                  Re-prescribe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionSection;