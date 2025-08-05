import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, Upload, FileText, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface GrievanceData {
  organization: string;
  organizationName: string;
  issueDescription: string;
  files: File[];
  referenceId?: string;
}

interface GrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GrievanceModal: React.FC<GrievanceModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<GrievanceData>({
    organization: '',
    organizationName: '',
    issueDescription: '',
    files: []
  });
  const [isListening, setIsListening] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if Speech Recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({
          ...prev,
          issueDescription: prev.issueDescription + ' ' + transcript
        }));
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const resetForm = () => {
    setFormData({
      organization: '',
      organizationName: '',
      issueDescription: '',
      files: []
    });
    setIsSubmitted(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.organization) {
      newErrors.organization = 'Please select an organization type';
    }
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Please enter organization name/ID';
    }
    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = 'Please describe your grievance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Generate unique reference ID
    const referenceId = uuidv4().substring(0, 8).toUpperCase();
    
    // Store data (in-memory for demo)
    const submittedData = {
      ...formData,
      referenceId,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Grievance submitted:', submittedData);
    
    setFormData(prev => ({ ...prev, referenceId }));
    setIsSubmitted(true);
    
    // Store in localStorage for persistence (demo purposes)
    localStorage.setItem(`grievance_${referenceId}`, JSON.stringify(submittedData));
  };

  const startVoiceRecording = () => {
    if (recognitionRef.current && speechSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf'];
      return validTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -2));
        }
        return file.type === type;
      });
    });

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('audio/')) return '🎵';
    if (file.type === 'application/pdf') return '📄';
    return '📎';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Lodge Grievance</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Organization Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Type *
            </label>
            <select
              value={formData.organization}
              onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.organization ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Organization Type</option>
              <option value="NGO">NGO</option>
              <option value="Labor Officer">Labor Officer</option>
              <option value="Company's Internal Committee">Company's Internal Committee</option>
            </select>
            {errors.organization && (
              <p className="mt-1 text-sm text-red-600">{errors.organization}</p>
            )}
          </div>

          {/* Organization Name/ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name/ID of the organization *
            </label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.organizationName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter organization name or ID"
            />
            {errors.organizationName && (
              <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>
            )}
          </div>

          {/* Issue Description with Voice Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Description *
            </label>
            <div className="relative">
              <textarea
                value={formData.issueDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
                rows={4}
                className={`w-full px-3 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.issueDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your grievance in detail..."
              />
              {speechSupported && (
                <button
                  type="button"
                  onClick={isListening ? stopVoiceRecording : startVoiceRecording}
                  className={`absolute right-2 top-2 p-2 rounded-full transition-colors ${
                    isListening
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isListening ? 'Stop recording' : 'Start voice input'}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}
            </div>
            {isListening && (
              <p className="mt-1 text-sm text-blue-600 flex items-center">
                <span className="animate-pulse mr-2">🎤</span>
                Listening... Speak now
              </p>
            )}
            {errors.issueDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.issueDescription}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Proof (Images, Videos, Audio, PDF)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Upload size={16} className="mr-2" />
              Add Proof +
            </button>
            
            {/* Display uploaded files */}
            {formData.files.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                    <div className="flex items-center">
                      <span className="mr-2">{getFileIcon(file)}</span>
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          {!isSubmitted ? (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Submit Grievance
            </button>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center text-green-600">
                <Check size={24} className="mr-2" />
                <span className="text-lg font-medium">Grievance Submitted Successfully!</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800 mb-2">Your Reference ID:</p>
                <p className="text-2xl font-bold text-green-900 font-mono tracking-wider">
                  {formData.referenceId}
                </p>
                <p className="text-xs text-green-700 mt-2">
                  Please save this reference ID for tracking your grievance.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default GrievanceModal;