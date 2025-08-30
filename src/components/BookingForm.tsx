'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, Mail, Phone, MapPin } from 'lucide-react';

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
  onBookingComplete?: (bookingData: BookingFormData & { price: number; serviceType: string; bedSizes?: Record<number, string> }) => void;
}

export default function BookingForm({ serviceType, onStepChange, onBookingComplete }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [price, setPrice] = useState(0);
  const [_bedSizes] = useState<Record<number, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    trigger, 
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
  }, [watchedBedrooms, watchedBathrooms, watchedLivingAreas, serviceType, calculatePrice]);

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
                  className="input-field"
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
                  className="input-field"
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
                  className="input-field"
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
w                  <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
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
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    {...register('date')}
                    className="input-field pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    {...register('time')}
                    className="input-field pl-10"
                  >
                    <option value="">Select a time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
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
