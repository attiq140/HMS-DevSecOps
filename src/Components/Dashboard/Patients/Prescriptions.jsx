import React, { useState } from 'react';
import { 
  FaUserMd, FaDownload, FaPaperclip, FaChevronDown, FaChevronUp,
  FaEdit, FaTrash, FaPlus, FaFileUpload, FaPrint
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

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

const Prescriptions = ({ role = 'patient' }) => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: "RX-2023-1001",
      date: "2023-06-15",
      doctor: "Dr. Sarah Johnson",
      department: "Cardiology",
      diagnosis: "Hypertension",
      status: "active",
      medicines: [
        {
          name: "Lisinopril",
          dosage: "10 mg",
          form: "Tablet",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take in morning"
        },
        {
          name: "Atorvastatin",
          dosage: "20 mg",
          form: "Tablet",
          frequency: "Once at bedtime",
          duration: "30 days",
          instructions: "Take with food"
        }
      ],
      advice: "Monitor blood pressure regularly. Reduce sodium intake. Exercise for 30 minutes daily.",
      followUp: "2023-07-15",
      attachments: [
        { id: 1, name: 'Blood_Test_Report.pdf', type: 'PDF', date: '2023-06-10' },
        { id: 2, name: 'ECG_Results.pdf', type: 'PDF', date: '2023-06-12' }
      ]
    },
    {
      id: "RX-2023-0987",
      date: "2023-05-22",
      doctor: "Dr. Michael Chen",
      department: "General Medicine",
      diagnosis: "Seasonal Allergies",
      status: "completed",
      medicines: [
        {
          name: "Loratadine",
          dosage: "10 mg",
          form: "Tablet",
          frequency: "Once daily",
          duration: "14 days",
          instructions: "Take as needed for allergy symptoms"
        }
      ],
      advice: "Avoid known allergens. Use nasal saline spray as needed.",
      followUp: "None required",
      attachments: []
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [activePrescription, setActivePrescription] = useState(null);

  const handleDownload = (prescription) => {
    try {
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: `Prescription_${prescription.id}`,
        author: prescription.doctor,
        creator: 'Healthcare System'
      });

      // Add logo and header
      doc.setFontSize(20);
      doc.setTextColor(40, 53, 147);
      doc.text('HEALTHCARE SYSTEM', 105, 20, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('PRESCRIPTION', 105, 30, { align: 'center' });
      
      // Add prescription details
      doc.setFontSize(12);
      doc.text(`Prescription ID: ${prescription.id}`, 20, 45);
      doc.text(`Date: ${prescription.date}`, 20, 55);
      doc.text(`Doctor: ${prescription.doctor}`, 20, 65);
      doc.text(`Department: ${prescription.department}`, 20, 75);
      doc.text(`Diagnosis: ${prescription.diagnosis}`, 20, 85);
      doc.text(`Status: ${prescription.status.toUpperCase()}`, 20, 95);

      // Medications
      doc.text('Medications:', 20, 110);
      let yPos = 120;
      prescription.medicines.forEach((medicine, index) => {
        doc.text(
          `${index + 1}. ${medicine.name} (${medicine.dosage}) - ${medicine.frequency}, ${medicine.duration}`,
          25,
          yPos
        );
        doc.text(`   Instructions: ${medicine.instructions}`, 25, yPos + 5);
        yPos += 15;
      });

      // Advice and Follow-up
      doc.text(`Advice: ${prescription.advice}`, 20, yPos);
      yPos += 10;
      doc.text(`Follow-up Date: ${prescription.followUp}`, 20, yPos);

      // Save the PDF
      doc.save(`Prescription_${prescription.id}.pdf`);
      toast.success('Prescription downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download prescription.');
    }
  };

  const handlePrint = (prescription) => {
    toast.info('Print functionality would open print dialog in a real app');
    // In a real app, this would trigger the browser's print dialog
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`Uploading file: ${file.name}`);
      toast.success('File uploaded successfully!');
    }
  };

  const handleDelete = (id) => {
    if (role !== 'doctor') return;
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    toast.success('Prescription deleted successfully!');
  };

  const handleEdit = (prescription) => {
    if (role !== 'doctor') return;
    setIsEditMode(true);
    setEditId(prescription.id);
    setActivePrescription(prescription);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setEditId(null);
    setActivePrescription({
      id: '',
      date: new Date().toISOString().split('T')[0],
      doctor: '',
      department: '',
      diagnosis: '',
      status: 'active',
      medicines: [],
      advice: '',
      followUp: '',
      attachments: []
    });
    setIsModalOpen(true);
  };

  const handleSave = (data) => {
    if (role !== 'doctor') return;

    // Validate form
    const newErrors = {};
    if (!data.diagnosis?.trim()) newErrors.diagnosis = 'Diagnosis is required';
    if (!data.doctor?.trim()) newErrors.doctor = 'Doctor is required';
    if (!data.date?.trim()) newErrors.date = 'Date is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditMode) {
      setPrescriptions(prescriptions.map(p => p.id === editId ? { ...p, ...data } : p));
      toast.success('Prescription updated successfully!');
    } else {
      setPrescriptions([...prescriptions, { 
        id: `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        ...data 
      }]);
      toast.success('Prescription added successfully!');
    }
    
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setErrors({});
  };

  const PrescriptionModal = () => {
    const [formData, setFormData] = useState(activePrescription);
    const [newMedicine, setNewMedicine] = useState({
      name: '',
      dosage: '',
      form: '',
      frequency: '',
      duration: '',
      instructions: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleMedicineChange = (e) => {
      const { name, value } = e.target;
      setNewMedicine({ ...newMedicine, [name]: value });
    };

    const addMedicine = () => {
      if (!newMedicine.name || !newMedicine.dosage) return;
      setFormData({
        ...formData,
        medicines: [...formData.medicines, newMedicine]
      });
      setNewMedicine({
        name: '',
        dosage: '',
        form: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    };

    const removeMedicine = (index) => {
      const updatedMedicines = [...formData.medicines];
      updatedMedicines.splice(index, 1);
      setFormData({ ...formData, medicines: updatedMedicines });
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {isEditMode ? 'Edit Prescription' : 'Add New Prescription'}
            </h3>
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
                setEditId(null);
                setErrors({});
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <input
                  type="text"
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.doctor ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter doctor's name"
                />
                {errors.doctor && <p className="text-red-500 text-xs mt-1">{errors.doctor}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter department"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${errors.diagnosis ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter diagnosis"
              />
              {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Medications</h4>
              
              {formData.medicines.length > 0 && (
                <div className="mb-4 space-y-3">
                  {formData.medicines.map((medicine, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md flex justify-between items-start">
                      <div>
                        <p className="font-medium">{medicine.name} ({medicine.dosage})</p>
                        <p className="text-sm">{medicine.frequency} for {medicine.duration}</p>
                        <p className="text-sm text-gray-600">Instructions: {medicine.instructions}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Medicine Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newMedicine.name}
                      onChange={handleMedicineChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., Lisinopril"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Dosage</label>
                    <input
                      type="text"
                      name="dosage"
                      value={newMedicine.dosage}
                      onChange={handleMedicineChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., 10 mg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Form</label>
                    <input
                      type="text"
                      name="form"
                      value={newMedicine.form}
                      onChange={handleMedicineChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., Tablet"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                    <input
                      type="text"
                      name="frequency"
                      value={newMedicine.frequency}
                      onChange={handleMedicineChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., Once daily"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={newMedicine.duration}
                      onChange={handleMedicineChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="e.g., 30 days"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Instructions</label>
                  <input
                    type="text"
                    name="instructions"
                    value={newMedicine.instructions}
                    onChange={handleMedicineChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Special instructions"
                  />
                </div>

                <button
                  type="button"
                  onClick={addMedicine}
                  className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100"
                >
                  <FaPlus className="mr-1.5 h-3 w-3" /> Add Medication
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Advice</label>
              <textarea
                name="advice"
                value={formData.advice}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Enter medical advice for the patient"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                name="followUp"
                value={formData.followUp}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditId(null);
                  setErrors({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(formData)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditMode ? 'Update Prescription' : 'Save Prescription'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
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
      />

      {/* Modal */}
      {isModalOpen && <PrescriptionModal />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 animate-scaleIn">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaUserMd className="text-3xl sm:text-4xl text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2">
            Prescriptions
          </h1>
        </div>

        {role === 'doctor' && (
          <button
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus className="mr-2" /> Add Prescription
          </button>
        )}
      </div>

      {/* Prescriptions List */}
      <div className="space-y-6">
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FaUserMd className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No prescriptions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {role === 'doctor' 
                ? "Get started by adding a new prescription." 
                : "You don't have any prescriptions yet."}
            </p>
            {role === 'doctor' && (
              <div className="mt-6">
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaPlus className="mr-2" /> Add Prescription
                </button>
              </div>
            )}
          </div>
        ) : (
          prescriptions.map((prescription) => (
            <motion.div 
              key={prescription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn"
            >
              <div 
                className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                onClick={() => setActivePrescription(activePrescription?.id === prescription.id ? null : prescription)}
              >
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Prescription #{prescription.id}</h2>
                  <p className="text-sm text-gray-600">Issued: {prescription.date} by {prescription.doctor}</p>
                </div>
                <div className="flex items-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    prescription.status === 'active' ? 'bg-green-100 text-green-800' : 
                    prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {prescription.status.toUpperCase()}
                  </span>
                  {activePrescription?.id === prescription.id ? (
                    <FaChevronUp className="ml-4 text-gray-500" />
                  ) : (
                    <FaChevronDown className="ml-4 text-gray-500" />
                  )}
                </div>
              </div>
              
              {activePrescription?.id === prescription.id && (
                <div className="px-6 py-4 border-t border-gray-200">
                  {/* Patient and Doctor Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Patient Information</h3>
                      <p>John Doe (ID: PT-10045)</p>
                      <p>35 years, Male</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Doctor Information</h3>
                      <p>{prescription.doctor}</p>
                      <p>{prescription.department}</p>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Diagnosis</h3>
                    <p>{prescription.diagnosis}</p>
                  </div>

                  {/* Medications */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Medications</h3>
                      {role === 'doctor' && (
                        <button
                          onClick={() => handleEdit(prescription)}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <FaEdit className="mr-1 h-3 w-3" /> Edit
                        </button>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {prescription.medicines.map((medicine, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{medicine.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{medicine.dosage}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{medicine.frequency}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{medicine.duration}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{medicine.instructions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Additional Advice */}
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Additional Advice</h3>
                    <p>{prescription.advice}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="font-semibold mb-2">Follow-up Date</h3>
                      <p>{prescription.followUp || 'Not specified'}</p>
                    </div>
                    
                    <div className="flex space-x-3">
                      {prescription.attachments.length > 0 && (
                        <div className="flex items-center">
                          <FaPaperclip className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {prescription.attachments.length} attachment{prescription.attachments.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => handleDownload(prescription)}
                        className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100"
                      >
                        <FaDownload className="mr-1.5 h-3 w-3" /> Download
                      </button>
                      <button
                        onClick={() => handlePrint(prescription)}
                        className="flex items-center px-3 py-1.5 bg-gray-50 text-gray-600 rounded-md text-sm hover:bg-gray-100"
                      >
                        <FaPrint className="mr-1.5 h-3 w-3" /> Print
                      </button>
                      {role === 'doctor' && (
                        <button
                          onClick={() => handleDelete(prescription.id)}
                          className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100"
                        >
                          <FaTrash className="mr-1.5 h-3 w-3" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Prescriptions;