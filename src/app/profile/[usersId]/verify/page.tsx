"use client" 
import React, { useState, useRef, useEffect } from 'react';
import { Mail, Upload, Video, FileText, Image, User, Building2, CheckCircle, Camera, X, LucideIcon } from 'lucide-react';

// Type definitions
interface FormData {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  ownerName: string;
  idType: 'nin' | 'passport' | 'drivers';
}

interface UploadedFiles {
  [key: string]: File;
}

interface FileUploadBoxProps {
  label: string;
  fileType: string;
  accept: string;
  icon: LucideIcon;
}

const BizConVerification = () => {
  const [accountType, setAccountType] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    ownerName: '',
    idType: 'nin',
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleEmailVerification = () => {
    if (email) {
      // Simulate email sending
      setEmailSent(true);
      setTimeout(() => {
        alert('Email verified successfully!');
        setEmailSent(false);
      }, 2000);
    }
  };

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access denied or not available');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (fileType: string, files: FileList | null) => {
    if (files && files.length > 0) {
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: files[0]
      }));
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitVerification = () => {
    if (accountType === 'user') {
      if (!email) {
        alert('Please enter your email address');
        return;
      }
      handleEmailVerification();
    } else {
      // Check required fields for business
      const requiredFields: (keyof FormData)[] = ['businessName', 'businessAddress', 'businessPhone', 'ownerName'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0 || !uploadedFiles.idDocument || !videoBlob) {
        alert('Please fill in all required fields and complete verification steps');
        return;
      }
      
      alert('Business verification submitted successfully! We will review your application within 2-3 business days.');
    }
  };

  const FileUploadBox: React.FC<FileUploadBoxProps> = ({ label, fileType, accept, icon: Icon }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFileUpload(fileType, e.target.files)}
        className="hidden"
        id={fileType}
      />
      <label htmlFor={fileType} className="cursor-pointer">
        <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-500 mt-1">Click to upload</p>
        {uploadedFiles[fileType] && (
          <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            {uploadedFiles[fileType].name}
          </p>
        )}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <h1 className="text-5xl font-bold mb-4">BizCon</h1>
              <p className="text-xl text-gray-600">Business & Users Connect - Account Verification</p>
            </div>
          </div>

          {/* Account Type Selection */}
          {!accountType && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Choose Your Account Type</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setAccountType('user')}
                  className="border-2 border-gray-200 rounded-xl p-8 text-center hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <User className="mx-auto h-16 w-16 text-blue-500 group-hover:scale-110 transition-transform mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">User Account</h3>
                  <p className="text-gray-600">Quick email verification for individual users</p>
                </div>
                
                <div 
                  onClick={() => setAccountType('business')}
                  className="border-2 border-gray-200 rounded-xl p-8 text-center hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <Building2 className="mx-auto h-16 w-16 text-indigo-500 group-hover:scale-110 transition-transform mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">Business Account</h3>
                  <p className="text-gray-600">Complete verification with documents and video</p>
                </div>
              </div>
            </div>
          )}

          {/* User Verification */}
          {accountType === 'user' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setAccountType('')}
                  className="mr-4 p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-3xl font-bold text-gray-800">User Verification</h2>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <button
                  onClick={submitVerification}
                  disabled={emailSent}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {emailSent ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Verification Email Sent!
                    </span>
                  ) : (
                    'Send Verification Email'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Business Verification */}
          {accountType === 'business' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setAccountType('')}
                  className="mr-4 p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-3xl font-bold text-gray-800">Business Verification</h2>
              </div>

              <div className="space-y-8">
                {/* Business Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter business name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Owner Full Name *</label>
                      <input
                        type="text"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter owner name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
                      <input
                        type="text"
                        value={formData.businessAddress}
                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter business address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone *</label>
                      <input
                        type="tel"
                        value={formData.businessPhone}
                        onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* ID Document Upload */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Identity Verification *</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select ID Type</label>
                    <select
                      value={formData.idType}
                      onChange={(e) => handleInputChange('idType', e.target.value as FormData['idType'])}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="nin">National ID Number (NIN)</option>
                      <option value="passport">International Passport</option>
                      <option value="drivers">Driver's License</option>
                    </select>
                  </div>
                  <FileUploadBox
                    label={`Upload ${formData.idType.toUpperCase()} Document`}
                    fileType="idDocument"
                    accept="image/*,application/pdf"
                    icon={FileText}
                  />
                </div>

                {/* Video Verification */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Video Verification *</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    {!videoBlob ? (
                      <div className="text-center">
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          className={`w-full max-w-md mx-auto rounded-lg ${!isRecording ? 'hidden' : ''}`}
                        />
                        {!isRecording && (
                          <div className="mb-4">
                            <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-4">Record a clear video of yourself for identity verification</p>
                          </div>
                        )}
                        <button
                          onClick={isRecording ? stopVideoRecording : startVideoRecording}
                          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            isRecording 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <p className="text-green-600 font-medium">Video recorded successfully!</p>
                        <button
                          onClick={() => {setVideoBlob(null); setIsRecording(false);}}
                          className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                        >
                          Record Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Documents */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Documents (Optional)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FileUploadBox
                      label="Business Logo"
                      fileType="logo"
                      accept="image/*"
                      icon={Image}
                    />
                    <FileUploadBox
                      label="Business Registration"
                      fileType="registration"
                      accept="image/*,application/pdf"
                      icon={FileText}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t">
                  <button
                    onClick={submitVerification}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Submit Business Verification
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-4">
                    * Required fields. We'll review your application within 2-3 business days.
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

export default BizConVerification;