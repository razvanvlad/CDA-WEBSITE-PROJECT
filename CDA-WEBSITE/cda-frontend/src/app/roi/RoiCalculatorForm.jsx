"use client";

import { useState } from 'react';
import ResponsiveUnderlinedTitle from '@/components/ResponsiveUnderlinedTitle';
import Image from 'next/image';

export default function RoiCalculatorForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    monthlySales: '',
    monthlyOrders: '',
    monthlyTraffic: '',
    engagementRate: '',
    industry: '',
    name: '',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.monthlySales || parseFloat(formData.monthlySales) <= 0) {
      newErrors.monthlySales = 'Please enter a valid monthly sales value';
    }
    if (!formData.monthlyOrders || parseFloat(formData.monthlyOrders) <= 0) {
      newErrors.monthlyOrders = 'Please enter a valid number of orders';
    }
    if (!formData.monthlyTraffic || parseFloat(formData.monthlyTraffic) <= 0) {
      newErrors.monthlyTraffic = 'Please enter a valid traffic number';
    }
    if (!formData.engagementRate || parseFloat(formData.engagementRate) <= 0) {
      newErrors.engagementRate = 'Please enter a valid engagement rate';
    }
    if (!formData.industry.trim()) {
      newErrors.industry = 'Please select your industry';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/roi-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowConfirmation(true);
        // Reset form
        setFormData({
          monthlySales: '',
          monthlyOrders: '',
          monthlyTraffic: '',
          engagementRate: '',
          industry: '',
          name: '',
          email: ''
        });
        setCurrentStep(1);
      } else {
        alert('There was an error submitting the form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-16 px-[38px] md:px-6 lg:px-8">
        <div className="max-w-2xl text-center">
          <div className="mb-8">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <ResponsiveUnderlinedTitle as="h1" underlineColor="#01E486" className="mb-6">
            Thank You!
          </ResponsiveUnderlinedTitle>
          <p className="text-lg text-gray-700 mb-8">
            Your ROI Calculator submission has been received. We'll be in touch with your personalized analysis soon.
          </p>
          <button
            onClick={() => setShowConfirmation(false)}
            className="button-l"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-16 lg:pt-20 lg:pb-44 bg-white overflow-hidden">
      {/* Desktop image - positioned from viewport edge, below text */}
      <div className="hidden lg:block absolute left-0 top-[490px] w-[959px] pointer-events-none z-20">
        <Image
          src="/images/roi-calculator.svg"
          alt="ROI Calculator Illustration"
          width={959}
          height={600}
          className="w-full h-auto"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-[38px] md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left 1/3 - Title and Text */}
          <div className="lg:col-span-1 order-1">
            <div className="mb-6">
              <ResponsiveUnderlinedTitle as="h1" underlineColor="#01E486">
                ROI Calculator
              </ResponsiveUnderlinedTitle>
            </div>

            <p className="text-gray-700 leading-relaxed mb-8 text-base lg:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco nisi laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.
            </p>
          </div>

          {/* Right 2/3 - Form */}
          <div className="lg:col-span-2 bg-[#F4F4F4] p-6 lg:p-8 rounded-lg min-h-[600px] order-2">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-900">
                  Step {currentStep} of 2
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {currentStep === 1 ? '50%' : '100%'}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="relative h-[1px] w-full bg-gray-300">
                <div
                  className="absolute top-0 left-0 h-full bg-[#01E486] transition-all duration-300"
                  style={{ width: currentStep === 1 ? '50%' : '100%' }}
                ></div>
              </div>
            </div>

            <form onSubmit={currentStep === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              {/* Step 1: Business Metrics */}
              {currentStep === 1 && (
                <>
                  {/* 2-Column Grid for Step 1 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Question 1: Monthly Web Sales */}
                    <div>
                      <label htmlFor="monthlySales" className="block text-sm font-semibold text-gray-900 mb-2">
                        1. What is the value of your current monthly web sales?
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                        <input
                          type="number"
                          id="monthlySales"
                          name="monthlySales"
                          value={formData.monthlySales}
                          onChange={handleChange}
                          className={`w-full pl-8 pr-4 py-3 bg-white border ${errors.monthlySales ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-black`}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      {errors.monthlySales && <p className="mt-1 text-sm text-red-500">{errors.monthlySales}</p>}
                    </div>

                    {/* Question 2: Monthly Orders */}
                    <div>
                      <label htmlFor="monthlyOrders" className="block text-sm font-semibold text-gray-900 mb-2">
                        2. How many orders do you get on average per month?
                      </label>
                      <input
                        type="number"
                        id="monthlyOrders"
                        name="monthlyOrders"
                        value={formData.monthlyOrders}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border ${errors.monthlyOrders ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-black`}
                        placeholder="0"
                        min="0"
                      />
                      {errors.monthlyOrders && <p className="mt-1 text-sm text-red-500">{errors.monthlyOrders}</p>}
                    </div>

                    {/* Question 3: Monthly Traffic */}
                    <div>
                      <label htmlFor="monthlyTraffic" className="block text-sm font-semibold text-gray-900 mb-2">
                        3. What is your average monthly website traffic?
                      </label>
                      <input
                        type="number"
                        id="monthlyTraffic"
                        name="monthlyTraffic"
                        value={formData.monthlyTraffic}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border ${errors.monthlyTraffic ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-black`}
                        placeholder="0"
                        min="0"
                      />
                      {errors.monthlyTraffic && <p className="mt-1 text-sm text-red-500">{errors.monthlyTraffic}</p>}
                    </div>

                    {/* Question 4: Engagement Rate */}
                    <div>
                      <label htmlFor="engagementRate" className="block text-sm font-semibold text-gray-900 mb-2">
                        4. What is your average monthly engagement rate?
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="engagementRate"
                          name="engagementRate"
                          value={formData.engagementRate}
                          onChange={handleChange}
                          className={`w-full px-4 pr-10 py-3 bg-white border ${errors.engagementRate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-black`}
                          placeholder="0.0"
                          step="0.1"
                          min="0"
                          max="100"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                      </div>
                      {errors.engagementRate && <p className="mt-1 text-sm text-red-500">{errors.engagementRate}</p>}
                    </div>
                  </div>

                  {/* Question 5: Industry (Full Width) */}
                  <div>
                    <label htmlFor="industry" className="block text-sm font-semibold text-gray-900 mb-2">
                      5. What industry are you in?
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border ${errors.industry ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-black`}
                    >
                      <option value="">Select an industry</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="retail">Retail</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="professional-services">Professional Services</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.industry && <p className="mt-1 text-sm text-red-500">{errors.industry}</p>}
                  </div>

                  {/* Next Button */}
                  <div className="pt-6 flex justify-center">
                    <button
                      type="submit"
                      className="button-l-transparent"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <>
                  {/* 2-Column Grid for Step 2 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Question 6: Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                        6. Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-black`}
                        placeholder="Your full name"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Question 7: Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                        7. Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-black`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Back and Submit Buttons */}
                  <div className="pt-6 flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="button-l-transparent"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="button-l"
                    >
                      {isSubmitting ? 'Submitting...' : 'Calculate ROI'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Mobile image - shown after form on mobile */}
          <div className="lg:hidden -mx-[38px] md:-mx-6 order-3">
            <Image
              src="/images/roi-calculator.svg"
              alt="ROI Calculator Illustration"
              width={959}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
