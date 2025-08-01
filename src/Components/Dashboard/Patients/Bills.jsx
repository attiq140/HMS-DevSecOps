import React, { useState } from 'react';
import { 
  FaDollarSign, FaFileInvoice, FaReceipt, FaCreditCard, 
  FaPrint, FaDownload, FaEye, FaPlus, FaFilter,
  FaChevronDown, FaChevronUp, FaTimes, FaSave
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
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  input:checked + .toggle-slider {
    background-color: #3b82f6;
  }
  input:checked + .toggle-slider:before {
    transform: translateX(26px);
  }
`;

const Bills = () => {
  // State for form data and edit mode
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [isViewingInvoice, setIsViewingInvoice] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempFormData, setTempFormData] = useState({});

  // State for active sections
  const [activeSections, setActiveSections] = useState({
    summary: true,
    invoices: true,
    services: true,
    payments: true,
    insurance: true
  });

  // Sample data
  const [billingSummary, setBillingSummary] = useState({
    totalAmount: 4850.00,
    amountPaid: 3500.00,
    outstandingBalance: 1350.00,
    paymentStatus: 'Partially Paid'
  });

  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2023-001',
      date: '2023-05-15',
      services: ['Consultation', 'Lab Tests'],
      amount: 850.00,
      status: 'Paid'
    },
    {
      id: 'INV-2023-002',
      date: '2023-06-02',
      services: ['Surgery', 'Medication', 'Room Charge'],
      amount: 4000.00,
      status: 'Partially Paid'
    }
  ]);

  const [serviceBreakdown, setServiceBreakdown] = useState([
    { name: 'Consultation', amount: 200.00 },
    { name: 'Lab Tests', amount: 650.00 },
    { name: 'Surgery', amount: 3000.00 },
    { name: 'Medication', amount: 800.00 },
    { name: 'Room Charge', amount: 200.00 }
  ]);

  const [paymentHistory, setPaymentHistory] = useState([
    {
      date: '2023-05-16',
      amount: 850.00,
      method: 'Credit Card',
      receiptNo: 'RC-001'
    },
    {
      date: '2023-06-05',
      amount: 2650.00,
      method: 'Insurance',
      receiptNo: 'RC-002'
    }
  ]);

  const [insuranceDetails, setInsuranceDetails] = useState({
    provider: 'HealthCare Plus',
    policyNumber: 'HCP-789456',
    coverage: '80% of hospitalization',
    claimStatus: 'Approved'
  });

  // Helper functions
  const toggleSection = (section) => {
    setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesDate = dateFilter ? invoice.date === dateFilter : true;
    const matchesStatus = statusFilter === 'all' ? true : invoice.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesDate && matchesStatus;
  });

  const handleDownload = (invoice) => {
    try {
      const doc = new jsPDF();
      doc.setProperties({
        title: `Invoice_${invoice.id}`,
        creator: 'Healthcare System'
      });
      doc.setFontSize(20);
      doc.text('Invoice', 20, 20);
      doc.setFontSize(12);
      doc.text(`Invoice ID: ${invoice.id}`, 20, 30);
      doc.text(`Date: ${invoice.date}`, 20, 40);
      doc.text(`Amount: $${invoice.amount.toFixed(2)}`, 20, 50);
      doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 60);
      doc.text('Services:', 20, 70);
      let yPos = 80;
      invoice.services.forEach((service, index) => {
        doc.text(`${index + 1}. ${service}`, 25, yPos);
        yPos += 10;
      });
      doc.save(`Invoice_${invoice.id}.pdf`);
      showToast('Invoice downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Failed to download invoice.', 'error');
    }
  };

  const handlePrint = (invoice) => {
    showToast('Printing functionality would open the print dialog in a real app', 'info');
  };

  const handleViewInvoice = (invoice) => {
    setActiveInvoice(invoice);
    setIsViewingInvoice(true);
  };

  const handleMakePayment = () => {
    setIsModalOpen(true);
  };

  const handleGenerateNewBill = () => {
    setIsGeneratingBill(true);
    setTimeout(() => {
      const newInvoiceId = `INV-2023-${String(invoices.length + 1).padStart(3, '0')}`;
      const newInvoice = {
        id: newInvoiceId,
        date: new Date().toISOString().split('T')[0],
        services: ['New Consultation'],
        amount: 250.00,
        status: 'Unpaid'
      };
      setInvoices([...invoices, newInvoice]);
      setBillingSummary({
        ...billingSummary,
        totalAmount: billingSummary.totalAmount + newInvoice.amount,
        outstandingBalance: billingSummary.outstandingBalance + newInvoice.amount,
        paymentStatus: 'Partially Paid'
      });
      showToast(`New bill ${newInvoiceId} generated successfully!`, 'success');
      setIsGeneratingBill(false);
    }, 1500);
  };

  const handlePaymentSubmit = (data) => {
    const newErrors = {};
    if (!data.amount || data.amount <= 0) newErrors.amount = 'Valid amount is required';
    if (!data.method) newErrors.method = 'Payment method is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsProcessingPayment(true);
    setTimeout(() => {
      const paymentAmount = parseFloat(data.amount);
      const newPayment = {
        date: data.date,
        amount: paymentAmount,
        method: data.method,
        receiptNo: `RC-${String(paymentHistory.length + 1).padStart(3, '0')}`
      };
      setPaymentHistory([...paymentHistory, newPayment]);
      const newAmountPaid = billingSummary.amountPaid + paymentAmount;
      const newOutstanding = Math.max(0, billingSummary.outstandingBalance - paymentAmount);
      setBillingSummary({
        ...billingSummary,
        amountPaid: newAmountPaid,
        outstandingBalance: newOutstanding,
        paymentStatus: newOutstanding === 0 ? 'Paid' : 'Partially Paid'
      });
      const updatedInvoices = invoices.map(inv => {
        if (inv.status !== 'Paid' && inv.amount <= paymentAmount) {
          return { ...inv, status: 'Paid' };
        } else if (inv.status !== 'Paid' && paymentAmount > 0) {
          return { ...inv, status: 'Partially Paid' };
        }
        return inv;
      });
      setInvoices(updatedInvoices);
      showToast(`Payment of $${data.amount} processed successfully!`, 'success');
      setIsModalOpen(false);
      setIsProcessingPayment(false);
      setErrors({});
    }, 2000);
  };

  const handleDownloadReceipt = (receiptNo) => {
    const receipt = paymentHistory.find(p => p.receiptNo === receiptNo);
    if (!receipt) return;
    try {
      const doc = new jsPDF();
      doc.setProperties({
        title: `Receipt_${receiptNo}`,
        creator: 'Healthcare System'
      });
      doc.setFontSize(20);
      doc.text('Payment Receipt', 20, 20);
      doc.setFontSize(12);
      doc.text(`Receipt #: ${receiptNo}`, 20, 30);
      doc.text(`Date: ${receipt.date}`, 20, 40);
      doc.text(`Amount: $${receipt.amount.toFixed(2)}`, 20, 50);
      doc.text(`Method: ${receipt.method}`, 20, 60);
      doc.save(`Receipt_${receiptNo}.pdf`);
      showToast('Receipt downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating receipt:', error);
      showToast('Failed to download receipt.', 'error');
    }
  };

  const showToast = (message, type) => {
    toast[type](message, {
      position: "top-right",
      autoClose: type === 'info' ? 2000 : 3000,
      hideProgressBar: type === 'info',
    });
  };

  const PaymentModal = () => {
    const [formData, setFormData] = useState({
      amount: '',
      method: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    return (
      <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Make Payment</h3>
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setErrors({});
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                max={billingSummary.outstandingBalance}
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Outstanding balance: ${billingSummary.outstandingBalance.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                name="method"
                value={formData.method}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${errors.method ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Insurance">Insurance</option>
                <option value="Cash">Cash</option>
              </select>
              {errors.method && <p className="text-red-500 text-xs mt-1">{errors.method}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Any additional notes"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setErrors({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isProcessingPayment}
              >
                Cancel
              </button>
              <button
                onClick={() => handlePaymentSubmit(formData)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'Processing...' : 'Process Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InvoiceViewModal = () => {
    if (!activeInvoice) return null;
    
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Invoice Details</h3>
            <button 
              onClick={() => {
                setIsViewingInvoice(false);
                setActiveInvoice(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Invoice #</p>
                <p className="font-medium">{activeInvoice.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{activeInvoice.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">${activeInvoice.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${
                    activeInvoice.status === 'Paid' ? 'text-green-600' :
                    activeInvoice.status === 'Partially Paid' ? 'text-yellow-600' :
                    'text-red-600'
                }`}>
                  {activeInvoice.status}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Services</h4>
              <ul className="list-disc pl-5 space-y-1">
                {activeInvoice.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => handleDownload(activeInvoice)}
                className="flex items-center px-3 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FaDownload className="mr-2" /> Download
              </button>
              <button
                onClick={() => handlePrint(activeInvoice)}
                className="flex items-center px-3 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200"
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
      {isModalOpen && <PaymentModal />}
      {isViewingInvoice && <InvoiceViewModal />}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 animate-scaleIn">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaDollarSign className="text-3xl sm:text-4xl text-blue-600" aria-hidden="true" />
            <FaFileInvoice className="absolute -bottom-1 right-1 text-lg sm:text-xl bg-white rounded-full p-1 text-blue-600 border-2 border-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center">
            Billing Dashboard
          </h1>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={handleGenerateNewBill}
            disabled={isGeneratingBill}
            className={`flex items-center px-4 py-2 rounded-md ${
              isGeneratingBill 
                ? 'bg-blue-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FaPlus className="mr-2" /> 
            {isGeneratingBill ? 'Generating...' : 'New Bill'}
          </button>
          <button
            onClick={handleMakePayment}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FaCreditCard className="mr-2" /> Make Payment
          </button>
        </div>
      </div>

      {/* Billing Summary */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('summary')}
        >
          <div className="flex items-center">
            <FaDollarSign className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Billing Summary</h2>
          </div>
          {activeSections.summary ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.summary && (
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">${billingSummary.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="p-2 rounded-full bg-blue-100">
                    <FaDollarSign className="text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Amount Paid</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">${billingSummary.amountPaid.toFixed(2)}</p>
                  </div>
                  <div className="p-2 rounded-full bg-green-100">
                    <FaDollarSign className="text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Outstanding Balance</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">${billingSummary.outstandingBalance.toFixed(2)}</p>
                  </div>
                  <div className="p-2 rounded-full bg-orange-100">
                    <FaDollarSign className="text-orange-600" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Payment Status</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">{billingSummary.paymentStatus}</p>
                  </div>
                  <div className="p-2 rounded-full bg-purple-100">
                    <FaDollarSign className="text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('invoices')}
        >
          <div className="flex items-center">
            <FaFileInvoice className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Invoices</h2>
          </div>
          {activeSections.invoices ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.invoices && (
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
              <h2 className="text-md font-bold text-gray-800 mb-3 sm:mb-0">Recent Invoices</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none w-full bg-gray-100 border border-gray-300 rounded-lg pl-2 pr-6 py-1.5 sm:pl-3 sm:pr-8 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="partially">Partially Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                  <FaFilter className="absolute right-2 sm:right-3 top-1.5 sm:top-2.5 text-gray-500 text-xs sm:text-sm" />
                </div>
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-gray-100 border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 sm:w-auto"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{invoice.id}</td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">{invoice.date}</td>
                      <td className="px-3 sm:px-6 py-3 text-xs sm:text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {invoice.services.map((service, idx) => (
                            <span key={idx} className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xxs sm:text-xs">{service}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">${invoice.amount.toFixed(2)}</td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xxs sm:text-xs font-medium ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex gap-1 sm:gap-2">
                          <button 
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View invoice"
                          >
                            <FaEye className="text-xs sm:text-sm" />
                          </button>
                          <button 
                            onClick={() => handleDownload(invoice)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Download invoice"
                          >
                            <FaDownload className="text-xs sm:text-sm" />
                          </button>
                          <button 
                            onClick={() => handlePrint(invoice)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Print invoice"
                          >
                            <FaPrint className="text-xs sm:text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Service Breakdown */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
          <div 
            className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => toggleSection('services')}
          >
            <div className="flex items-center">
              <FaFileInvoice className="mr-3 text-blue-500" />
              <h2 className="text-lg font-medium text-gray-900">Service Breakdown</h2>
            </div>
            {activeSections.services ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </div>
          
          {activeSections.services && (
            <div className="px-6 py-4">
              <div className="space-y-3">
                {serviceBreakdown.map((service, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                    <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">{service.name}</span>
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">${service.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
          <div 
            className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => toggleSection('payments')}
          >
            <div className="flex items-center">
              <FaReceipt className="mr-3 text-blue-500" />
              <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
            </div>
            {activeSections.payments ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </div>
          
          {activeSections.payments && (
            <div className="px-6 py-4">
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs sm:text-sm font-medium">Receipt #{payment.receiptNo}</span>
                      <span className="text-xs sm:text-sm text-green-600 font-medium">${payment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xxs sm:text-xs text-gray-500">
                      <span className="truncate pr-2">{payment.date} • {payment.method}</span>
                      <button 
                        onClick={() => handleDownloadReceipt(payment.receiptNo)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FaDownload size={12} className="sm:size-[14px]" /> 
                        <span className="hidden sm:inline">Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Insurance Details */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
          <div 
            className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => toggleSection('insurance')}
          >
            <div className="flex items-center">
              <FaCreditCard className="mr-3 text-blue-500" />
              <h2 className="text-lg font-medium text-gray-900">Insurance Details</h2>
            </div>
            {activeSections.insurance ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </div>
          
          {activeSections.insurance && (
            <div className="px-6 py-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xxs sm:text-xs text-gray-500">Provider</p>
                  <p className="text-xs sm:text-sm font-medium">{insuranceDetails.provider}</p>
                </div>
                <div>
                  <p className="text-xxs sm:text-xs text-gray-500">Policy Number</p>
                  <p className="text-xs sm:text-sm font-medium">{insuranceDetails.policyNumber}</p>
                </div>
                <div>
                  <p className="text-xxs sm:text-xs text-gray-500">Coverage</p>
                  <p className="text-xs sm:text-sm font-medium">{insuranceDetails.coverage}</p>
                </div>
                <div>
                  <p className="text-xxs sm:text-xs text-gray-500">Claim Status</p>
                  <p className={`text-xs sm:text-sm font-medium ${
                    insuranceDetails.claimStatus === 'Approved' ? 'text-green-600' : 
                    insuranceDetails.claimStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {insuranceDetails.claimStatus}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bills;