import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Available = () => {
  const { specialty } = useParams();
  const navigate = useNavigate();

  // Complete doctor data for all specialties
  const specialties = [
    {
      id: 1,
      name: "Neurologist",
      description: "Specialists in nervous system disorders",
      doctors: [
        {
          id: 1,
          name: "Dr. Amit Sharma",
          qualification: "MD, DM Neurology",
          experience: "15 years",
          timings: "Mon-Fri: 9 AM - 5 PM",
          fee: "₹1500"
        },
        {
          id: 2,
          name: "Dr. Priya Patel",
          qualification: "MBBS, DM Neurology",
          experience: "12 years",
          timings: "Mon-Sat: 10 AM - 7 PM",
          fee: "₹1800"
        }
      ]
    },
    {
      id: 2,
      name: "Cardiologist",
      description: "Heart and cardiovascular system specialists",
      doctors: [
        {
          id: 3,
          name: "Dr. Sanjay Verma",
          qualification: "MD, DM Cardiology",
          experience: "18 years",
          timings: "Mon-Fri: 8 AM - 4 PM",
          fee: "₹2000"
        }
      ]
    },
    {
      id: 3,
      name: "Dermatologist",
      description: "Skin, hair and nail specialists",
      doctors: [
        {
          id: 4,
          name: "Dr. Ritu Singh",
          qualification: "MBBS, MD Dermatology",
          experience: "10 years",
          timings: "Mon-Sat: 10 AM - 7 PM",
          fee: "₹1200"
        }
      ]
    },
    {
      id: 4,
      name: "Endocrinologist",
      description: "Hormone and glandular system experts",
      doctors: [
        {
          id: 5,
          name: "Dr. Neha Gupta",
          qualification: "MBBS, MD Endocrinology",
          experience: "8 years",
          timings: "Mon-Wed-Fri: 11 AM - 6 PM",
          fee: "₹1200"
        }
      ]
    },
    {
      id: 5,
      name: "Gastroenterologist",
      description: "Digestive system specialists",
      doctors: [
        {
          id: 6,
          name: "Dr. Rajesh Kumar",
          qualification: "MBBS, MD Gastroenterology",
          experience: "12 years",
          timings: "Tue-Sat: 8 AM - 3 PM",
          fee: "₹1800"
        }
      ]
    },
    {
      id: 6,
      name: "Gynecologist",
      description: "Women's health and pregnancy care",
      doctors: [
        {
          id: 7,
          name: "Dr. Anjali Desai",
          qualification: "MBBS, MD Gynecology",
          experience: "14 years",
          timings: "Mon-Sat: 9 AM - 6 PM",
          fee: "₹2200"
        }
      ]
    },
    {
      id: 7,
      name: "Oncologist",
      description: "Cancer diagnosis and treatment experts",
      doctors: [
        {
          id: 8,
          name: "Dr. Arjun Malhotra",
          qualification: "MBBS, MD Oncology",
          experience: "10 years",
          timings: "Tue-Thu-Sat: 11 AM - 8 PM",
          fee: "₹2500"
        }
      ]
    },
    {
      id: 8,
      name: "Pediatrician",
      description: "Child health and development specialists",
      doctors: [
        {
          id: 9,
          name: "Dr. Priya Nair",
          qualification: "MBBS, MD Pediatrics",
          experience: "9 years",
          timings: "Mon-Fri: 10 AM - 5 PM",
          fee: "₹1500"
        }
      ]
    }
  ];

  // Find the selected specialty
  const selectedSpecialty = specialties.find(
    spec => spec.name.toLowerCase() === specialty?.toLowerCase()
  );

  const handleBackClick = () => {
    navigate('/doctors');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Enhanced Back Button with prominent red hover */}
      <button 
        onClick={handleBackClick}
        className="absolute top-6 left-6 flex items-center gap-2 bg-white py-2 px-4 rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 z-10 group"
      >
        <ChevronLeft size={20} className="text-gray-600 group-hover:text-red-600 transition-colors" />
        <span className="font-medium">Back to Specialists</span>
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Available {selectedSpecialty?.name || specialty}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            {selectedSpecialty?.description || 'Expert care for your specific health needs'}
          </p>
        </div>

        {/* Doctors Grid */}
        {selectedSpecialty?.doctors?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {selectedSpecialty.doctors.map(doctor => (
              <div 
                key={doctor.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col h-full"
              >
                {/* Profile Image Section */}
                <div className="h-56 w-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
                  <div className="relative z-10 h-32 w-32 rounded-full bg-white p-1 shadow-md">
                    <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
                      {doctor.name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{doctor.name}</h2>
                  <p className="text-blue-600 font-medium mb-2">{doctor.qualification}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {doctor.timings}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {doctor.experience} experience
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-800 font-medium">Consultation Fee:</span>
                      <span className="text-xl font-bold text-red-600">{doctor.fee}</span>
                    </div>
                    <Link
                      to={`/book-appointment/${specialty}/${doctor.id}`}
                      className="block w-full text-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-md"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl text-gray-700 mb-4">No doctors available in this specialty</h3>
            <button 
              onClick={handleBackClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ChevronLeft className="mr-1" size={18} />
              Back to Specialists
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Available;