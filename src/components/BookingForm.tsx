'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, Mail, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const bookingSchema = z.object({
  bedrooms: z.number().min(1, 'At least 1 bedroom required'),
  bathrooms: z.number().min(1, 'At least 1 bathroom required'),
  livingAreas: z.number().min(0, 'Living areas cannot be negative'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  serviceType: 'home' | 'airbnb';
  onStepChange: (step: number) => void;

}

export default function BookingForm({ serviceType, onStepChange }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [price, setPrice] = useState(0);
  const [_bedSizes] = useState<Record<number, string>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange', // Validate on change
    reValidateMode: 'onChange', // Re-validate on change
    defaultValues: { // Set default values properly
      bedrooms: 1,
      bathrooms: 1,
      livingAreas: 1,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      address: '',
      date: '',
      time: '',
    },
  });

  const watchedBedrooms = watch('bedrooms') || 0;
  const watchedBathrooms = watch('bathrooms') || 0;
  const watchedLivingAreas = watch('livingAreas') || 0;
  const watchedTime = watch('time') || '';
  const watchedDate = watch('date') || '';

  const timeOptions = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
  ];

  // Calculate price based on selections
  const calculatePrice = useCallback(() => {
    let basePrice = 0;
    
    // Base pricing
    basePrice += watchedBedrooms * 25; // $25 per bedroom
    basePrice += watchedBathrooms * 20; // $20 per bathroom
    basePrice += watchedLivingAreas * 15; // $15 per living area
    
    // Airbnb specific pricing
    if (serviceType === 'airbnb') {
      basePrice += 30; // Base Airbnb premium
    }
    
    return basePrice;
  }, [watchedBedrooms, watchedBathrooms, watchedLivingAreas, serviceType]);

  // Update price when selections change
  useEffect(() => {
    setPrice(calculatePrice());
    setIsDataLoaded(true); // Mark data as loaded after price calculation
  }, [watchedBedrooms, watchedBathrooms, watchedLivingAreas, serviceType, calculatePrice]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (isTimeDropdownOpen && !target.closest('.time-dropdown-container')) {
        setIsTimeDropdownOpen(false);
      }
      
      if (isDatePickerOpen && !target.closest('.date-picker-container')) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTimeDropdownOpen, isDatePickerOpen]);

  const nextStep = async () => {
    let isValid = false;
    
    // Validate fields for current step
    if (currentStep === 1) {
      isValid = await trigger(['bedrooms', 'bathrooms', 'livingAreas']);
    } else if (currentStep === 2) {
      isValid = await trigger(['customerName', 'customerEmail', 'customerPhone', 'address']);
    } else if (currentStep === 3) {
      isValid = await trigger(['date', 'time']);
    }
    
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
      onStepChange(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      onStepChange(currentStep - 1);
    }
  };


  const handleTimeSelect = (timeValue: string) => {
    setValue('time', timeValue);
    setIsTimeDropdownOpen(false);
  };

  const handleDateSelect = (dateValue: string) => {
    setValue('date', dateValue);
    setIsDatePickerOpen(false);
  };

  // Generate calendar dates
  const generateCalendarDates = () => {
    const currentMonth = currentCalendarDate.getMonth();
    const currentYear = currentCalendarDate.getFullYear();
    
    // Get first day of current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    
    // Get first day of calendar (might be from previous month)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    if (!watchedDate) return false;
    // Compare dates in local timezone to avoid timezone conversion issues
    const selectedDate = new Date(watchedDate + 'T00:00:00');
    return date.getFullYear() === selectedDate.getFullYear() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getDate() === selectedDate.getDate();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentCalendarDate.getMonth();
  };

  const formatDateForInput = (date: Date) => {
    // Use local timezone to avoid day offset issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentCalendarDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentCalendarDate(newDate);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentCalendarDate);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentCalendarDate(newDate);
  };

  const goToToday = () => {
    setCurrentCalendarDate(new Date());
  };


  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const onSubmit = () => {
    // Store booking data and navigate to payment page
    const formData = watch();
    const bookingData = {
      ...formData,
      price,
      serviceType,
      bedSizes: serviceType === 'airbnb' ? _bedSizes : undefined,
    };
    
    // Store in localStorage for the payment page
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Navigate to payment page
    window.location.href = '/payment';
  };



  const hasCurrentStepErrors = () => {
    if (currentStep === 1) {
      return !!(errors.bedrooms || errors.bathrooms || errors.livingAreas);
    } else if (currentStep === 2) {
      return !!(errors.customerName || errors.customerEmail || errors.customerPhone || errors.address);
    } else if (currentStep === 3) {
      return !!(errors.date || errors.time);
    }
    return false;
  };

  // Development mode: allow testing step 3 without previous steps
  const canProceedToNextStep = () => {
    if (process.env.NODE_ENV === 'development' && currentStep === 3) {
      return true; // Allow testing step 3 in development
    }
    return !hasCurrentStepErrors();
  };
  const showTestNavigation = true;
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line Background */}
          <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 rounded-full"></div>
          
          {/* Progress Line Fill */}
          <div 
            className="absolute top-4 left-4 h-1 rounded-full transition-all duration-700 ease-out progress-fill"
            style={{ 
              width: `${((currentStep - 1) / 2) * 100}%`,
              maxWidth: 'calc(100% - 2rem)',
              '--progress-width': `${((currentStep - 1) / 2) * 100}%`
            } as React.CSSProperties}
          ></div>
          
          {[1, 2, 3].map((step) => (
            <div key={step} className="relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ease-out ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Service Details</span>
          <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Personal Info</span>
          <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Schedule</span>
        </div>
      </div>

      {/* Test Navigation - Enable/disable by changing the condition below */}
      {process.env.NODE_ENV === 'development' && showTestNavigation && isDataLoaded && price > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">🧪 Development Mode - Test Navigation:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                onStepChange(1);
              }}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Step 1
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentStep(2);
                onStepChange(2);
              }}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Step 2
            </button>
            <button
              type="button"
              onClick={() => {
                // Set some default values for testing
                setValue('bedrooms', 2);
                setValue('bathrooms', 1);
                setValue('livingAreas', 1);
                setValue('customerName', 'Test User');
                setValue('customerEmail', 'test@example.com');
                setValue('customerPhone', '1234567890');
                setValue('address', '123 Test Street, Test City');
                setCurrentStep(3);
                onStepChange(3);
              }}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Step 3 (Test Time Picker)
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Service Details */}
        {currentStep === 1 && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('bedrooms', { valueAsNumber: true })}
                  className="input-field-number"
                />
                {errors.bedrooms && (
                  <p className="text-red-500 text-sm mt-1">{errors.bedrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('bathrooms', { valueAsNumber: true })}
                  className="input-field-number"
                />
                {errors.bathrooms && (
                  <p className="text-red-500 text-sm mt-1">{errors.bathrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Living Areas
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('livingAreas', { valueAsNumber: true })}
                  className="input-field-number"
                />
                {errors.livingAreas && (
                  <p className="text-red-500 text-sm mt-1">{errors.livingAreas.message}</p>
                )}
              </div>
            </div>



            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Estimated Price:</span>
                <span className="text-2xl font-bold text-blue-600">${price}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                disabled={hasCurrentStepErrors()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {currentStep === 2 && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    {...register('customerName')}
                    className="input-field pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    {...register('customerEmail')}
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.customerEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    {...register('customerPhone')}
                    className="input-field pl-10"
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    {...register('address')}
                    className="input-field pl-10"
                    rows={3}
                    placeholder="Enter your full address"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={hasCurrentStepErrors()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {currentStep === 3 && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Service</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative date-picker-container">
                  {isMobile ? (
                    // Native date picker for mobile with icon and placeholder
                    <>
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none z-10" />
                      <input
                        type="date"
                        {...register('date')}
                        min={new Date().toISOString().split('T')[0]}
                        className="input-field pl-10 text-left appearance-none bg-white cursor-pointer"
                        style={{ 
                          paddingLeft: '2.5rem !important',
                          paddingTop: '0.75rem',
                          paddingBottom: '0.75rem',
                          backgroundImage: 'none',
                          colorScheme: 'light',
                          color: watchedDate ? '#374151' : 'transparent',
                          height: 'auto',
                          minHeight: '2.5rem',
                          textAlign: 'left'
                        }}
                      />
                      {!watchedDate && (
                        <span className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                          Select a date
                        </span>
                      )}
                    </>
                  ) : (
                    // Custom date picker for desktop
                    <>
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none z-10" />
                      <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        className="input-field pl-10 text-left appearance-none bg-white cursor-pointer"
                        style={{ 
                          paddingLeft: '2.5rem',
                          backgroundImage: 'none',
                          color: watchedDate ? '#374151' : '#6b7280'
                        }}
                        data-selected={!!watchedDate}
                      >
                        {watchedDate ? formatDate(watchedDate) : 'Select a date'}
                      </button>
                      
                      {/* Hidden input for form validation */}
                      <input
                        type="hidden"
                        {...register('date')}
                      />
                    </>
                  )}
                  
                  {/* Custom calendar date picker - only for desktop */}
                  {!isMobile && isDatePickerOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-6 min-w-[320px]">
                      <div className="calendar">
                        {/* Calendar Header */}
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => navigateYear('prev')}
                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                              title="Previous year"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigateMonth('prev')}
                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                              title="Previous month"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900">
                            {currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </h3>
                          
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => navigateMonth('next')}
                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                              title="Next month"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigateYear('next')}
                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                              title="Next year"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarDates().map((date, index) => {
                            const isDisabled = isDateDisabled(date);
                            const isSelected = isDateSelected(date);
                            const isCurrentMonthDate = isCurrentMonth(date);
                            
                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => !isDisabled && handleDateSelect(formatDateForInput(date))}
                                disabled={isDisabled}
                                className={`
                                  w-10 h-10 text-sm rounded-lg transition-all duration-200 flex items-center justify-center font-medium
                                  ${isDisabled 
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : isSelected
                                    ? 'bg-white text-blue-600 font-bold shadow-xl ring-2 ring-blue-500 border-2 border-blue-500'
                                    : isCurrentMonthDate
                                    ? 'text-gray-900 hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
                                    : 'text-gray-400 hover:bg-gray-50 hover:scale-105'
                                  }
                                `}
                              >
                                {date.getDate()}
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Today indicator */}
                        <div className="mt-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              goToToday();
                              handleDateSelect(formatDateForInput(new Date()));
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="relative time-dropdown-container">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none z-10" />
                  <button
                    type="button"
                    onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                    className={`input-field pl-10 appearance-none bg-white cursor-pointer ${isMobile ? 'text-center' : 'text-left'}`}
                    style={{ 
                      paddingLeft: '2.5rem',
                      backgroundImage: 'none',
                      color: watchedTime ? '#374151' : '#6b7280'
                    }}
                    data-selected={!!watchedTime}
                  >
                    {watchedTime ? 
                      timeOptions.find(option => option.value === watchedTime)?.label || 'Select a time' 
                      : 'Select a time'
                    }
                  </button>
                  
                  {/* Hidden input for form validation */}
                  <input
                    type="hidden"
                    {...register('time')}
                  />
                  
                  {/* Custom dropdown */}
                  {isTimeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                      {timeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleTimeSelect(option.value)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            watchedTime === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Price:</span>
                <span className="text-2xl font-bold text-blue-600">${price}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!canProceedToNextStep()}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}


      </form>
    </div>
  );
}
