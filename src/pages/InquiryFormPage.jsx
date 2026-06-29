// src/pages/InquiryFormPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  Trash2, 
  Image as ImageIcon, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  AlertCircle,
  Upload,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { generateRef } from '../utils/generateRef';
import Logo from '../components/Logo';

export default function InquiryFormPage() {
  const navigate = useNavigate();
  
  // Static lists for selections
  const makeList = [
    'Audi', 'BMW', 'Chevrolet', 'Citroen', 'Daihatsu',
    'Fiat', 'Ford', 'Foton', 'Geely', 'Great Wall',
    'Haval', 'Hino', 'Honda', 'Hyundai', 'Isuzu',
    'Iveco', 'JAC', 'Jaguar', 'Jeep', 'Kia',
    'Land Rover', 'Lexus', 'MAN', 'Mazda', 'Mercedes-Benz',
    'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot',
    'Porsche', 'Proton', 'Renault', 'Scania', 'Skoda',
    'Subaru', 'Suzuki', 'Tata', 'Tesla', 'Toyota',
    'UD Trucks', 'Volkswagen', 'Volvo', 'Other'
  ];

  const yearList = Array.from({ length: 27 }, (_, i) => String(2026 - i));

  const automotiveCategory = 'Automotive Fleet & Parts';
  const serviceCategories = [
    'Hospitality and Events Management',
    'Business and Personal Services'
  ];

  const isServiceCategory = (category) => serviceCategories.includes(category);
  const isAutomotiveCategory = (category) => category === automotiveCategory;

  // Generate of stable Inquiry Reference ID on Mount
  const [refId] = useState(() => generateRef());

  // Step state: 1 | 2 | 3 | 'success'
  const [step, setStep] = useState(1);
  
  // Master form state
  const [formData, setFormData] = useState({
    // Step 1 — Personal Info
    title: '',              
    firstName: '',
    lastName: '',
    companyName: '',
    contactNumber: '',
    email: '',
    contactMethod: '',      

    // Step 2 — Sourcing Details
    productCategory: automotiveCategory,
    productType: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    chassisNumber: '',      

    // Step 3 — Parts Required
    partDescription: '',
    partName: '',
    partNumber: '',
    quantity: 1,
    urgency: '',
    notes: '',
    images: [] // Array of File objects
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const formFooterRef = useRef(null);
  const [submitError, setSubmitError] = useState('');

  // Standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productCategory') {
      const nextIsAutomotive = isAutomotiveCategory(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        productType: nextIsAutomotive ? '' : prev.productType,
        vehicleMake: nextIsAutomotive ? prev.vehicleMake : '',
        vehicleModel: nextIsAutomotive ? prev.vehicleModel : '',
        vehicleYear: nextIsAutomotive ? prev.vehicleYear : '',
        chassisNumber: nextIsAutomotive ? prev.chassisNumber : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (submitError) setSubmitError('');
    // Clear error for that field immediately
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Check valid status on each step
  const validateStep = (currentStep, data = formData) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!data.title) newErrors.title = 'Title selection is required.';
      if (!data.firstName.trim()) {
        newErrors.firstName = 'First name is required.';
      } else if (data.firstName.trim().length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters.';
      }
      if (!data.lastName.trim()) {
        newErrors.lastName = 'Last name is required.';
      } else if (data.lastName.trim().length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters.';
      }
      
      const parsedDigits = data.contactNumber.replace(/\D/g, '');
      if (!data.contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required.';
      } else if (parsedDigits.length < 7) {
        newErrors.contactNumber = 'Contact number must be at least 7 digits.';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!emailRegex.test(data.email.trim())) {
        newErrors.email = 'Please provide a valid email format.';
      }

      if (!data.contactMethod) {
        newErrors.contactMethod = 'Preferred contact method is required.';
      }
    }

    if (currentStep === 2) {
      if (!data.productCategory) {
        newErrors.productCategory = 'Sourcing category is required.';
      } else if (isAutomotiveCategory(data.productCategory)) {
        if (!data.vehicleMake) newErrors.vehicleMake = 'Vehicle brand/make is required.';
        if (!data.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model description is required.';
        if (!data.vehicleYear) newErrors.vehicleYear = 'Vehicle year of manufacture is required.';
      } else {
        if (!data.productType || !data.productType.trim()) {
          newErrors.productType = isServiceCategory(data.productCategory)
            ? 'Service requirement description is required.'
            : 'Product or equipment type description is required.';
        }
      }
    }

    if (currentStep === 3) {
      if (!data.partDescription.trim()) {
        newErrors.partDescription = isServiceCategory(data.productCategory)
          ? 'Please describe the service requirement.'
          : 'Please describe the part or issue.';
      } else if (data.partDescription.trim().length < 10) {
        newErrors.partDescription = 'Please provide a clearer specification (at least 10 characters).';
      }
      if (!data.partName.trim()) {
        newErrors.partName = isServiceCategory(data.productCategory)
          ? 'Please enter a service name.'
          : 'Please enter a name for the part.';
      }
    }

    setErrors(newErrors);
    return {
      valid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  const fieldElementIds = {
    title: 'title-select',
    firstName: 'firstname-input',
    lastName: 'lastname-input',
    contactNumber: 'phone-input',
    email: 'email-input',
    contactMethod: 'contact-method-select',
    productCategory: 'product-category-select',
    vehicleMake: 'make-select',
    vehicleModel: 'model-input',
    vehicleYear: 'year-select',
    productType: 'product-type-input',
    partDescription: 'part-desc-textarea',
    partName: 'part-name-input',
  };

  const scrollToFirstError = (errorFields) => {
    const firstField = Object.keys(errorFields)[0];
    if (!firstField) return;

    const elementId = fieldElementIds[firstField];
    const element = elementId ? document.getElementById(elementId) : null;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof element.focus === 'function') {
        element.focus({ preventScroll: true });
      }
    }
  };

  // Navigation handlers
  const handleNext = () => {
    const result = validateStep(step);
    if (result.valid) {
      setSubmitError('');
      setStep(prev => prev + 1);
      return;
    }

    setSubmitError('Please complete the required fields highlighted below.');
    scrollToFirstError(result.errors);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  // Image upload handling
  const handleImageUpload = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    processFiles(files);
  };

  const processFiles = (files) => {
    const currentImagesCount = formData.images.length;
    const allowedNewCount = 5 - currentImagesCount;

    if (allowedNewCount <= 0) {
      return;
    }

    const validFiles = files.filter(file => {
      const isImg = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isImg && isValidSize;
    }).slice(0, allowedNewCount);

    const newFiles = [...formData.images, ...validFiles];
    
    // Generate base64 previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({ ...prev, images: newFiles }));
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    processFiles(files);
  };

  // High-fidelity Submit handler (step 3 submit)
  const handleSubmitInquiry = () => {
    const submissionData = {
      ...formData,
      partName: formData.partName.trim(),
    };

    if (submissionData.partName !== formData.partName) {
      setFormData(submissionData);
    }

    const result = validateStep(3, submissionData);
    if (!result.valid) {
      setSubmitError('Please complete all required fields before submitting.');
      scrollToFirstError(result.errors);
      formFooterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const localInquiriesKey = 'global_goods_inquiries';
        const existingRaw = localStorage.getItem(localInquiriesKey);
        const list = existingRaw ? JSON.parse(existingRaw) : [];

        const mappedCategory = submissionData.productCategory || 'General Mechanics';

        const newRecord = {
          id: refId,
          createdAt: new Date().toISOString(),
          status: 'new',
          priority: submissionData.urgency === 'asap' ? 'urgent' : (submissionData.urgency === 'within_week' ? 'medium' : 'low'),
          category: mappedCategory,
          vehicleMake: submissionData.vehicleMake,
          vehicleModel: submissionData.vehicleModel,
          vehicleYear: parseInt(submissionData.vehicleYear, 10) || 2024,
          vehicleEngine: submissionData.chassisNumber ? 'Match (chassis)' : 'Standard Trim',
          partName: submissionData.partName,
          partNumber: submissionData.partNumber || 'Auto-Sourced',
          quantity: parseInt(submissionData.quantity, 10) || 1,
          urgency: submissionData.urgency,
          notes: submissionData.partDescription + (submissionData.notes ? ` | Additional note: ${submissionData.notes}` : ''),
          customerName: `${submissionData.firstName} ${submissionData.lastName}`,
          customerEmail: submissionData.email,
          customerPhone: submissionData.contactNumber,
          contactMethod: submissionData.contactMethod,
          company: submissionData.companyName || null,
          images: imagePreviews,
        };

        list.unshift(newRecord);

        try {
          localStorage.setItem(localInquiriesKey, JSON.stringify(list));
        } catch (storageError) {
          const recordWithoutImages = { ...newRecord, images: [] };
          const listWithoutImages = [recordWithoutImages, ...list.slice(1)];
          localStorage.setItem(localInquiriesKey, JSON.stringify(listWithoutImages));
        }

        setIsSubmitting(false);
        setStep('success');
      } catch (error) {
        console.error('Failed to submit inquiry:', error);
        setIsSubmitting(false);
        setSubmitError('Something went wrong while saving your inquiry. Please try again.');
      }
    }, 800);
  };

  // Master reset state back to step 1
  const handleReset = () => {
    setFormData({
      title: '',              
      firstName: '',
      lastName: '',
      companyName: '',
      contactNumber: '',
      email: '',
      contactMethod: '',      
      productCategory: automotiveCategory,
      productType: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      chassisNumber: '',      
      partDescription: '',
      partName: '',
      partNumber: '',
      quantity: 1,
      urgency: '',
      notes: '',
      images: []
    });
    setErrors({});
    setSubmitError('');
    setImagePreviews([]);
    setStep(1);
    // Reload a new reference ID
    navigate('/inquiry');
  };

  // Form input styles constants
  const inputStyle = (fieldName) => `
    w-full px-4 py-3 border-[1.5px] rounded-lg text-sm bg-gray-50/50 outline-none transition min-h-[44px]
    ${errors[fieldName] 
      ? 'border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/10' 
      : 'border-slate-200 focus:bg-white focus:border-[#29B8C8] focus:ring-2 focus:ring-[#29B8C8]/15'
    }
  `;

  const labelStyle = `
    block text-xs font-bold text-[#1B2A4A] uppercase tracking-wider mb-1.5
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B2A4A] via-[#1e3a6e] to-[#0d5060] px-4 py-12 flex flex-col justify-between">
      
      {/* Top Banner Brand */}
      <div className="text-center mb-10 shrink-0">
        <Link to="/" className="inline-flex flex-col items-center group">
          <Logo size="xl" variant="dark" layout="stacked" className="transition-transform group-hover:scale-[1.02] duration-300" />
        </Link>
      </div>

      {/* Progress Indicators (Only shown when not successful) */}
      {step !== 'success' && (
        <div className="w-full max-w-sm mx-auto mb-8 relative">
          <div className="flex items-center justify-between relative z-10">
            
            {/* Circle Step 1 */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step > 1 ? 'bg-[#5DC840] text-white' : (step === 1 ? 'bg-white text-[#1B2A4A] shadow-[0_0_0_3px_rgba(255,255,255,0.3)]' : 'bg-white/20 text-white/50')
              }`}>
                {step > 1 ? <Check className="h-4.5 w-4.5 stroke-[2.5]" /> : '1'}
              </div>
            </div>

            {/* Line 1 */}
            <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step > 1 ? 'bg-[#5DC840]' : 'bg-white/20'}`} />

            {/* Circle Step 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step > 2 ? 'bg-[#5DC840] text-white' : (step === 2 ? 'bg-white text-[#1B2A4A] shadow-[0_0_0_3px_rgba(255,255,255,0.3)]' : 'bg-white/20 text-white/50')
              }`}>
                {step > 2 ? <Check className="h-4.5 w-4.5 stroke-[2.5]" /> : '2'}
              </div>
            </div>

            {/* Line 2 */}
            <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step > 2 ? 'bg-[#5DC840]' : 'bg-white/20'}`} />

            {/* Circle Step 3 */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step === 3 ? 'bg-white text-[#1B2A4A] shadow-[0_0_0_3px_rgba(255,255,255,0.3)]' : 'bg-white/20 text-white/50'
              }`}>
                3
              </div>
            </div>

          </div>

          {/* Stepper text labels */}
          <div className="flex justify-between mt-2.5 px-1">
            <span className={`text-[10px] sm:text-xs text-center w-16 transition-colors font-medium ${step === 1 ? 'text-white font-bold' : 'text-white/40'}`}>
              Your Details
            </span>
            <span className={`text-[10px] sm:text-xs text-center w-16 transition-colors font-medium ${step === 2 ? 'text-white font-bold' : 'text-white/40'}`}>
              Sourcing Details
            </span>
            <span className={`text-[10px] sm:text-xs text-center w-16 transition-colors font-medium ${step === 3 ? 'text-white font-bold' : 'text-white/40'}`}>
              Items Needed
            </span>
          </div>
        </div>
      )}

      {/* Main Form/Content Container in grid centering */}
      <div className="flex-1 max-w-xl mx-auto w-full flex flex-col justify-center">
        
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 relative flex flex-col">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: YOUR DETAILS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-heading text-2xl font-extrabold text-[#1B2A4A]">
                    Your Details
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Tell us who you are so we can get back to you.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Title & First Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-4">
                    <div>
                      <label className={labelStyle}>Title</label>
                      <select
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={inputStyle('title')}
                        id="title-select"
                        placeholder="Select Title"
                      >
                        <option value="">Select title...</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                        <option value="Prof">Prof</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.title && <p className={errors.title ? 'text-red-500 text-xs mt-1' : 'hidden'}>{errors.title}</p>}
                    </div>

                    <div>
                      <label className={labelStyle}>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className={inputStyle('firstName')}
                        id="firstname-input"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className={labelStyle}>Last Name / Surname</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Smith"
                      className={inputStyle('lastName')}
                      id="lastname-input"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>

                  {/* Company Name (Optional) */}
                  <div>
                    <label className={labelStyle}>
                      Company Name
                      <span className="text-gray-400 font-normal normal-case text-xs inline ml-1">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Acme Parts Ltd"
                      className={inputStyle('companyName')}
                      id="company-input"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className={labelStyle}>Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="+230 5XXX XXXX"
                      className={inputStyle('contactNumber')}
                      id="phone-input"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Include country code, e.g. +230 for Mauritius
                    </p>
                    {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className={labelStyle}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={inputStyle('email')}
                      id="email-input"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className={labelStyle}>How should we contact you?</label>
                    <select
                      name="contactMethod"
                      value={formData.contactMethod}
                      onChange={handleChange}
                      className={inputStyle('contactMethod')}
                      id="contact-method-select"
                    >
                      <option value="">Select method...</option>
                      <option value="Email">Email</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone Call">Phone Call</option>
                    </select>
                    {errors.contactMethod && <p className="text-red-500 text-xs mt-1">{errors.contactMethod}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SOURCING DETAILS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-heading text-2xl font-extrabold text-[#1B2A4A]" id="step2-title">
                    What are you sourcing?
                  </h2>
                  <p className="text-gray-500 text-sm mt-1" id="step2-subtitle">
                    We source both products and services. Choose a category, then provide the relevant details.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Product Category dropdown */}
                  <div>
                    <label className={labelStyle}>Product Category</label>
                    <select
                      name="productCategory"
                      value={formData.productCategory || automotiveCategory}
                      onChange={handleChange}
                      className={inputStyle('productCategory')}
                      id="product-category-select"
                    >
                      <option value="">Select category...</option>
                      <optgroup label="Services">
                        <option value="Hospitality and Events Management">Hospitality and Events Management</option>
                        <option value="Business and Personal Services">Business and Personal Services (Vehicle License Renewal, Passport, Identity Document, Birth Certificate, Visas etc)</option>
                      </optgroup>
                      <optgroup label="Products">
                        <option value="Food and Beverage">Food and Beverage</option>
                        <option value="Health and Medical Equipment">Health and Medical Equipment</option>
                        <option value="Furniture and Interior Decor">Furniture and Interior Decor</option>
                        <option value="Solar and Renewable Energy">Solar and Renewable Energy</option>
                        <option value="Automotive Fleet & Parts">Automotive Fleet &amp; Parts</option>
                        <option value="Heavy Duty Machinery & Equipment">Heavy Duty Machinery &amp; Equipment</option>
                        <option value="MRO Supplies (Maintenance, Repair & Operating)">MRO Supplies (Maintenance, Repair &amp; Operating)</option>
                        <option value="Building & Construction Materials">Building &amp; Construction Materials</option>
                        <option value="Electrical & Electronic Equipment">Electrical &amp; Electronic Equipment</option>
                        <option value="Mining Equipment">Mining Equipment</option>
                        <option value="Oil & Gas Equipment">Oil &amp; Gas Equipment</option>
                        <option value="Pharmaceutical & Medical Equipment">Pharmaceutical &amp; Medical Equipment</option>
                        <option value="HVAC-R Equipment">HVAC-R Equipment</option>
                        <option value="Networks & Communication Equipment">Networks &amp; Communication Equipment</option>
                        <option value="Rolling Stock">Rolling Stock</option>
                        <option value="Safety & Security Equipment">Safety &amp; Security Equipment</option>
                        <option value="Clean Energy Technologies">Clean Energy Technologies</option>
                        <option value="Industrial Products & Equipment">Industrial Products &amp; Equipment</option>
                        <option value="Other / Not Listed">Other / Not Listed</option>
                      </optgroup>
                    </select>
                    {errors.productCategory && <p className="text-red-500 text-xs mt-1">{errors.productCategory}</p>}
                  </div>

                  {/* Hide/Show logic based on selection */}
                  {(isAutomotiveCategory(formData.productCategory) || !formData.productCategory) ? (
                    <>
                      {/* Make + Model Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelStyle}>Make / Brand</label>
                          <select
                            name="vehicleMake"
                            value={formData.vehicleMake}
                            onChange={handleChange}
                            className={inputStyle('vehicleMake')}
                            id="make-select"
                          >
                            <option value="">Select make...</option>
                            {makeList.map(make => (
                              <option key={make} value={make}>{make}</option>
                            ))}
                          </select>
                          {errors.vehicleMake && <p className="text-red-500 text-xs mt-1">{errors.vehicleMake}</p>}
                        </div>

                        <div>
                          <label className={labelStyle}>Model Name</label>
                          <input
                            type="text"
                            name="vehicleModel"
                            value={formData.vehicleModel}
                            onChange={handleChange}
                            placeholder="e.g. Hilux, 3 Series, Ranger..."
                            className={inputStyle('vehicleModel')}
                            id="model-input"
                          />
                          {errors.vehicleModel && <p className="text-red-500 text-xs mt-1">{errors.vehicleModel}</p>}
                        </div>
                      </div>

                      {/* Year + Chassis/VIN Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelStyle}>Manufacture Year</label>
                          <select
                            name="vehicleYear"
                            value={formData.vehicleYear}
                            onChange={handleChange}
                            className={inputStyle('vehicleYear')}
                            id="year-select"
                          >
                            <option value="">Select year...</option>
                            {yearList.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                            <option value="1999 or older">1999 or older</option>
                          </select>
                          {errors.vehicleYear && <p className="text-red-500 text-xs mt-1">{errors.vehicleYear}</p>}
                        </div>

                        <div>
                          <label className={labelStyle}>
                            Chassis / VIN Number
                            <span className="text-gray-400 font-normal normal-case text-xs inline ml-1">(optional)</span>
                          </label>
                          <input
                            type="text"
                            name="chassisNumber"
                            value={formData.chassisNumber}
                            onChange={handleChange}
                            placeholder="e.g. JTFBT22P900XXXXX"
                            className={`${inputStyle('chassisNumber')} uppercase`}
                            id="vin-input"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100 block">
                          💡 Tip: The 17-character VIN can be found stamped on your registration document, lower corner of driver-side windshield, or inside the driver door frame. Having this ensures absolute fitment compliance.
                        </span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className={labelStyle}>
                        {isServiceCategory(formData.productCategory) ? 'Service Required' : 'Product / Equipment Type'}
                      </label>
                      <input
                        type="text"
                        name="productType"
                        value={formData.productType || ''}
                        onChange={handleChange}
                        placeholder={
                          isServiceCategory(formData.productCategory)
                            ? 'e.g. Corporate event setup, visa processing for 4 travelers, passport renewal assistance...'
                            : 'e.g. 50kW diesel generator, 6-inch gate valve, hydraulic pump model XYZ...'
                        }
                        className={inputStyle('productType')}
                        id="product-type-input"
                      />
                      {errors.productType && <p className="text-red-500 text-xs mt-1">{errors.productType}</p>}
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* STEP 3: PARTS REQUIRED */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 text-xs"
              >
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1B2A4A] tracking-tight">
                    {isServiceCategory(formData.productCategory) ? 'Specify Your Requirements' : 'Specify Your Items'}
                  </h2>
                  <p className="text-gray-500 text-xs mt-1 mb-1">
                    {isServiceCategory(formData.productCategory)
                      ? 'Share scope, quantity, and timelines so our team can match and quote quickly.'
                      : 'Detail the exact parts, quantities, and preferred brands you require. Our tech matchmaking starts immediately.'}
                  </p>
                </div>

                <div className="space-y-3.5 max-h-[58vh] overflow-y-auto pr-1">
                  
                  {/* Part Description text-area */}
                  <div>
                    <label className={labelStyle}>
                      {isServiceCategory(formData.productCategory) ? 'Describe your service requirement' : 'Describe the part or issue'}
                    </label>
                    <textarea
                      name="partDescription"
                      rows="3"
                      value={formData.partDescription}
                      onChange={handleChange}
                      placeholder={
                        isServiceCategory(formData.productCategory)
                          ? 'e.g. Need assistance for 6 visa applications and travel documentation before 15 August...'
                          : 'e.g. My car won\'t start in the morning, I think it\'s the starter motor or battery...'
                      }
                      className={inputStyle('partDescription')}
                      id="part-desc-textarea"
                    />
                    {errors.partDescription && <p className="text-red-500 text-[11px] mt-1">{errors.partDescription}</p>}
                  </div>



                  {/* Part Name & Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>{isServiceCategory(formData.productCategory) ? 'Service Name' : 'Part Name'}</label>
                      <input
                        type="text"
                        name="partName"
                        value={formData.partName}
                        onChange={handleChange}
                        placeholder={isServiceCategory(formData.productCategory) ? 'e.g. Visa Processing Service' : 'e.g. Starter Motor'}
                        className={inputStyle('partName')}
                        id="part-name-input"
                      />
                      {errors.partName && <p className="text-red-500 text-[11px] mt-1">{errors.partName}</p>}
                    </div>

                    <div>
                      <label className={labelStyle}>
                        {isServiceCategory(formData.productCategory) ? 'Reference Number' : 'Part Number / MPN'}
                        <span className="text-gray-400 font-normal normal-case text-xs inline ml-1">(optional)</span>
                      </label>
                      <input
                        type="text"
                        name="partNumber"
                        value={formData.partNumber}
                        onChange={handleChange}
                        placeholder={isServiceCategory(formData.productCategory) ? 'e.g. Service code or internal reference' : 'e.g. 28100-0L010'}
                        className={`${inputStyle('partNumber')} font-mono`}
                        id="part-number-input"
                      />
                    </div>
                  </div>

                  {/* Quantity input */}
                  <div className="max-w-[130px]">
                    <label className={labelStyle}>Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      max="999"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border-[1.5px] border-slate-200 rounded-lg text-xs bg-gray-50/50 focus:bg-white focus:border-[#29B8C8] outline-none font-semibold font-mono"
                      id="qty-input"
                    />
                  </div>

                  {/* Additional Notes (Optional) */}
                  <div>
                    <label className={labelStyle}>
                      Additional Notes
                      <span className="text-gray-400 font-normal normal-case text-xs inline ml-1">(optional)</span>
                    </label>
                    <textarea
                      name="notes"
                      rows="2"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any other details — OEM preference, budget range, specific supplier, colour, etc."
                      className={inputStyle('notes')}
                      id="additional-notes-textarea"
                    />
                  </div>

                  {/* Interactive Image Upload Section */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className={labelStyle}>
                      Upload Pictures
                      <span className="text-gray-400 font-normal normal-case text-xs inline ml-1">(optional)</span>
                    </label>
                    <p className="text-gray-400 text-[11px] mb-2 font-normal">
                      Photos of the part, damage, or your vehicle help us find the exact match. Max 5 images, 5MB each.
                    </p>

                    {/* Hidden Native Input */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      multiple 
                      accept="image/*"
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />

                    {/* Styled Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                        isDragging 
                          ? 'border-[#29B8C8] bg-[#e0f7fa]/30 scale-[0.99]' 
                          : 'border-slate-200 hover:border-[#29B8C8] hover:bg-[#e0f7fa]/10 bg-slate-50/20'
                      }`}
                      id="image-dropzone"
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Upload className="h-8 w-8 text-slate-350 animate-bounce" />
                        <span className="text-slate-500 font-bold text-xs mt-1">Click to upload or drag &amp; drop</span>
                        <span className="text-slate-350 text-[10px] font-normal">PNG, JPG, WEBP up to 5MB each</span>
                      </div>
                    </div>

                    {/* Previews and feedback indicators */}
                    {imagePreviews.length > 0 && (
                      <div className="space-y-2 pt-1.5">
                        
                        {/* Image count tracker badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-450 font-normal">
                            {imagePreviews.length} of 5 images selected
                          </span>
                          {imagePreviews.length >= 5 && (
                            <span className="text-[10px] text-[#29B8C8] font-bold uppercase tracking-wider">
                              Maximum reached
                            </span>
                          )}
                        </div>

                        {/* Previews grid */}
                        <div className="grid grid-cols-4 gap-2">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative rounded-lg overflow-hidden border border-slate-200 aspect-square group shadow-sm bg-slate-50">
                              <img 
                                src={preview} 
                                alt={`upload-preview-${index}`} 
                                className="w-full h-full object-cover" 
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(index);
                                }}
                                className="absolute top-1 right-1 h-5.5 w-5.5 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md transition-colors"
                                aria-label="Remove image preview"
                                id={`remove-image-${index}`}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>

                      </div>
                    )}

                  </div>

                </div>
              </motion.div>
            )}

            {/* SUCCESS SCREEN */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="py-6 text-center space-y-5"
                id="inquiry-success-view"
              >
                {/* Scale trigger once */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 180, delay: 0.1 }}
                  className="text-6xl select-none"
                  role="img" 
                  aria-label="Celebrating party pop"
                >
                  🎉
                </motion.div>

                <div>
                  <h2 className="font-heading text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
                    Inquiry Submitted!
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-brand-navy font-semibold">{formData.firstName}</strong>! We've received your request and our technical division will review it shortly.
                  </p>
                </div>

                {/* Unique Ref Pill */}
                <div className="bg-[#e8f9e3] border border-[#5DC840] text-[#3a9e22] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full inline-block my-1 shadow-sm font-mono tracking-wide">
                  RFQ ID: {refId}
                </div>

                {/* Next Steps List */}
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-150 text-left max-w-md mx-auto space-y-3">
                  <h3 className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                    What Happens Next?
                  </h3>
                  <ul className="space-y-3.5 text-xs text-slate-600 leading-normal font-normal">
                    <li className="flex items-start gap-2.5">
                      <div className="h-4.5 w-4.5 rounded-full bg-[#5DC840]/20 text-[#3a9e22] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>
                        <strong>Double Technical Review</strong>: We analyze specs and double-check engineering fitment parameters immediately.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="h-4.5 w-4.5 rounded-full bg-[#5DC840]/20 text-[#3a9e22] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>
                        <strong>Dynamic Global Matchmaking</strong>: Our search engine matches the most accurate manufacturers and secures the best factory-direct wholesale pricing.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="h-4.5 w-4.5 rounded-full bg-[#5DC840]/20 text-[#3a9e22] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>
                        <strong>Direct Sourcing Brokerage</strong>: A broker will connect with you via WhatsApp, Phone, or Email with commercial quotes.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Summary Metadata Card */}
                <div className="bg-slate-50/30 p-4 rounded-xl border border-slate-100 text-left max-w-sm mx-auto space-y-2.5 text-xs">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest border-b border-slate-100 pb-1.5">
                    Live Sourcing Summary Details
                  </div>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">VEHICLE</span>
                      <strong className="text-slate-705 font-medium">{formData.vehicleMake || 'N/A'} {formData.vehicleModel || 'N/A'} ({formData.vehicleYear || 'N/A'})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">PART DEMAND</span>
                      <strong className="text-slate-705 font-medium">{formData.partName || 'N/A'} (x {formData.quantity})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">URGENCY</span>
                      <strong className="text-[#3a9e22] font-semibold">{formData.urgency === 'asap' ? 'ASAP / Urgent' : (formData.urgency === 'within_week' ? 'Within 1 Week' : 'Flexible') }</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">PRIMARY EMAIL</span>
                      <strong className="text-slate-705 font-mono break-all">{formData.email || 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                {/* Secondary buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-center justify-center">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-500 hover:text-slate-700 rounded-full font-bold transition-all text-xs"
                    id="back-another-ticket-btn"
                  >
                    Submit Another Inquiry
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#5DC840] to-[#29B8C8] text-white rounded-full font-bold transition-all text-xs"
                    id="return-home-success-btn"
                  >
                    Return to Homepage
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

          {/* FORM NAVIGATION BUTTONS FOOTER - Hidden on success screen */}
          {step !== 'success' && (
            <div ref={formFooterRef} className="border-t border-gray-100 pt-6 mt-6 flex flex-col gap-4 shrink-0 sticky bottom-0 bg-white z-10">
              {submitError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              
              {/* Step counter for mobile (positioned at the top, centered) */}
              <div className="sm:hidden text-center text-slate-400 font-semibold text-[10px] uppercase tracking-widest font-mono">
                Step {step} of 3
              </div>

              {/* Navigation button wrapper targeting mobile touch compliance (min-h-44px) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                
                {/* Back button or Cancel & Home */}
                <div className="flex-1 sm:flex-none">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-full sm:w-auto border border-slate-250 text-slate-500 hover:text-slate-700 hover:border-slate-350 rounded-full px-3.5 sm:px-5 py-2.5 text-[11px] sm:text-xs font-bold transition-all min-h-[44px] flex items-center justify-center whitespace-nowrap"
                      id="form-back-btn"
                    >
                      &larr; Back
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="w-full sm:w-auto border border-slate-250 text-slate-500 hover:text-slate-700 hover:border-slate-350 rounded-full px-3 sm:px-5 py-2.5 text-[11px] sm:text-xs font-bold transition-all min-h-[44px] flex items-center justify-center text-center leading-none whitespace-nowrap"
                    >
                      Cancel &amp; Home
                    </Link>
                  )}
                </div>

                {/* Step counter for desktop (positioned in between buttons) */}
                <div className="hidden sm:block text-slate-400 font-medium text-[11px] uppercase tracking-widest font-mono">
                  Step {step} of 3
                </div>

                {/* Continue/Submit button */}
                <div className="flex-1 sm:flex-none">
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto bg-gradient-to-r from-[#5DC840] to-[#29B8C8] hover:shadow-lg hover:brightness-105 active:scale-[0.99] text-white rounded-full px-4 sm:px-6 py-2.5 text-[11px] sm:text-xs font-bold transition-all min-h-[44px] flex items-center justify-center whitespace-nowrap"
                      id="form-next-btn"
                    >
                      Continue &rarr;
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmitInquiry}
                      className="w-full sm:w-auto bg-gradient-to-r from-[#5DC840] to-[#29B8C8] hover:shadow-lg hover:brightness-105 active:scale-[0.99] text-white rounded-full px-4 sm:px-6 py-2.5 text-[11px] sm:text-xs font-extrabold transition-all disabled:opacity-50 flex items-center justify-center min-h-[44px] whitespace-nowrap"
                      id="form-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin shrink-0 mr-2" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Inquiry ✓'
                      )}
                    </button>
                  )}
                </div>

              </div>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
