import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { FaArrowRight, FaUserMd, FaStethoscope, FaHeartbeat, FaBrain, FaChild, FaFlask, FaAllergies, FaXRay } from 'react-icons/fa';

// Importing all doctor images
import A1 from '../assets/A1.avif';
import A2 from '../assets/A2.avif';
import A3 from '../assets/A3.avif';
import A4 from '../assets/A4.avif';
import A5 from '../assets/A5.avif';
import A6 from '../assets/A6.avif';
import A7 from '../assets/A7.avif';
import A8 from '../assets/A8.avif';

const Doctors = () => {
  const navigate = useNavigate();

  const doctorCategories = [
    {
      id: 1,
      name: "Neurologist",
      description: 'Specialists in nervous system disorders',
      detailedDescription: 'Our neurologists specialize in diagnosing and treating disorders of the nervous system including the brain, spinal cord, and peripheral nerves. They manage conditions such as epilepsy, stroke, multiple sclerosis, Parkinson\'s disease, and migraines using advanced diagnostic tools and treatments.',
      image: A1,
      route: '/available/neurologist',
      icon: <FaBrain className="text-purple-500 text-3xl" />
    },
    {
      id: 2,
      name: "Oncologist",
      description: 'Cancer diagnosis and treatment experts',
      detailedDescription: 'Our oncologists provide comprehensive cancer care including diagnosis, chemotherapy, radiation therapy, and targeted treatments. They specialize in various cancer types and work with a multidisciplinary team to develop personalized treatment plans for each patient.',
      image: A2,
      route: '/available/oncologist',
      icon: <FaFlask className="text-indigo-500 text-3xl" />
    },
    {
      id: 3,
      name: "Dermatologist",
      description: 'Skin, hair and nail specialists',
      detailedDescription: 'Our dermatologists diagnose and treat conditions affecting the skin, hair, and nails. They provide medical treatments for acne, eczema, psoriasis, and skin cancer, as well as cosmetic procedures to improve skin appearance and health.',
      image: A3,
      route: '/available/dermatologist',
      icon: <FaAllergies className="text-pink-500 text-3xl" />
    },
    {
      id: 4,
      name: "Endocrinologist",
      description: 'Hormone and glandular system experts',
      detailedDescription: 'Our endocrinologists specialize in treating hormonal imbalances and endocrine system disorders. They manage conditions such as diabetes, thyroid disorders, metabolic disorders, osteoporosis, and growth abnormalities with personalized treatment approaches.',
      image: A4,
      route: '/available/endocrinologist',
      icon: <FaStethoscope className="text-blue-500 text-3xl" />
    },
    {
      id: 5,
      name: "Gastroenterologist",
      description: 'Digestive system specialists',
      detailedDescription: 'Our gastroenterologists diagnose and treat disorders of the digestive system including the esophagus, stomach, intestines, liver, pancreas, and gallbladder. They perform endoscopic procedures and provide treatments for conditions like GERD, IBS, Crohn\'s disease, and hepatitis.',
      image: A5,
      route: '/available/gastroenterologist',
      icon: <FaStethoscope className="text-green-500 text-3xl" />
    },
    {
      id: 6,
      name: "Gynecologist",
      description: 'Women\'s health and pregnancy care',
      detailedDescription: 'Our gynecologists provide comprehensive care for women\'s reproductive health including routine exams, contraceptive counseling, pregnancy care, and treatment for conditions like endometriosis, PCOS, and menopause symptoms. They perform surgeries when necessary and focus on preventive care.',
      image: A6,
      route: '/available/gynecologist',
      icon: <FaUserMd className="text-red-500 text-3xl" />
    },
    {
      id: 7,
      name: "Cardiologist",
      description: 'Heart and cardiovascular system experts',
      detailedDescription: 'Our cardiologists specialize in preventing, diagnosing, and treating heart and vascular conditions. They perform diagnostic tests like echocardiograms and stress tests, and provide treatments for coronary artery disease, heart failure, arrhythmias, and hypertension using medications and procedures.',
      image: A7,
      route: '/available/cardiologist',
      icon: <FaHeartbeat className="text-red-500 text-3xl" />
    },
    {
      id: 8,
      name: "Pediatrician",
      description: 'Child health and development specialists',
      detailedDescription: 'Our pediatricians provide medical care for infants, children, and adolescents. They focus on preventive health through well-child visits, vaccinations, and developmental screenings, while also treating acute illnesses and managing chronic conditions specific to children.',
      image: A8,
      route: '/available/pediatrician',
      icon: <FaChild className="text-yellow-500 text-3xl" />
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          Our Specialist Doctors
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
          Expert <span className="text-red-600">Medical Specialists</span>
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-600">
          Highly qualified specialists providing exceptional care in their respective fields
        </p>
      </div>

      {/* Doctor Categories Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctorCategories.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full group"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <LazyLoadImage
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  effect="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-3 shadow-md">
                  {doctor.icon}
                </div>
                <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  {doctor.name}
                </h3>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 mb-6 flex-grow">{doctor.description}</p>
                <div className="mt-auto">
                  <button
                    onClick={() => handleCardClick(doctor.route)}
                    className="flex items-center justify-between text-white bg-red-600 font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:bg-red-700 w-full"
                  >
                    <span>View Specialists</span>
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;