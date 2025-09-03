import { useState } from "react";
import Layout from "@/components/Layout.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils.js";
import {
  Upload,
  File,
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  User,
  CreditCard,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";

const steps = [
  { id: 1, name: "Patient Info", icon: User, description: "Basic patient information" },
  { id: 2, name: "Claim Details", icon: FileText, description: "Service and treatment details" },
  { id: 3, name: "Insurance", icon: CreditCard, description: "Insurance information" },
  { id: 4, name: "Documents", icon: Upload, description: "Upload supporting documents" },
  { id: 5, name: "Review", icon: CheckCircle, description: "Review and submit" },
];

export default function SubmitClaimPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    patientDob: "",
    patientPhone: "",
    patientEmail: "",
    serviceDate: "",
    provider: "",
    diagnosis: "",
    treatmentType: "",
    amount: "",
    description: "",
    insuranceCompany: "",
    policyNumber: "",
    groupNumber: "",
    files: [],
  });
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      // Basic validation
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitClaim = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would submit to the backend
    console.log("Submitting claim:", formData);
    
    setIsSubmitting(false);
    // Redirect to dashboard or show success message
  };

  const progress = (currentStep / 5) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientName" className="text-gray-300">
                  Patient Full Name *
                </Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => updateFormData("patientName", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  placeholder="Enter patient's full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientId" className="text-gray-300">
                  Patient ID *
                </Label>
                <Input
                  id="patientId"
                  value={formData.patientId}
                  onChange={(e) => updateFormData("patientId", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  placeholder="Enter patient ID"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientDob" className="text-gray-300">
                  Date of Birth *
                </Label>
                <Input
                  id="patientDob"
                  type="date"
                  value={formData.patientDob}
                  onChange={(e) => updateFormData("patientDob", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientPhone" className="text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="patientPhone"
                  type="tel"
                  value={formData.patientPhone}
                  onChange={(e) => updateFormData("patientPhone", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="patientEmail" className="text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={formData.patientEmail}
                  onChange={(e) => updateFormData("patientEmail", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  placeholder="patient@example.com"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serviceDate" className="text-gray-300">
                  Service Date *
                </Label>
                <Input
                  id="serviceDate"
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) => updateFormData("serviceDate", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="provider" className="text-gray-300">
                  Healthcare Provider *
                </Label>
                <Input
                  id="provider"
                  value={formData.provider}
                  onChange={(e) => updateFormData("provider", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  placeholder="Provider name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="treatmentType" className="text-gray-300">
                  Treatment Type *
                </Label>
                <Select onValueChange={(value) => updateFormData("treatmentType", value)}>
                  <SelectTrigger className="bg-dark-bg-secondary border-gray-600 text-white">
                    <SelectValue placeholder="Select treatment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-bg-secondary border-gray-600">
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="diagnostic">Diagnostic</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="outpatient">Outpatient</SelectItem>
                    <SelectItem value="inpatient">Inpatient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-300">
                  Claim Amount *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => updateFormData("amount", e.target.value)}
                    className="pl-10 bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="diagnosis" className="text-gray-300">
                  Diagnosis *
                </Label>
                <Input
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => updateFormData("diagnosis", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  placeholder="Enter diagnosis or procedure code"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  placeholder="Additional details about the treatment or service"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="insuranceCompany" className="text-gray-300">
                  Insurance Company *
                </Label>
                <Input
                  id="insuranceCompany"
                  value={formData.insuranceCompany}
                  onChange={(e) => updateFormData("insuranceCompany", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  placeholder="Insurance company name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="policyNumber" className="text-gray-300">
                  Policy Number *
                </Label>
                <Input
                  id="policyNumber"
                  value={formData.policyNumber}
                  onChange={(e) => updateFormData("policyNumber", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  placeholder="Policy number"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="groupNumber" className="text-gray-300">
                  Group Number
                </Label>
                <Input
                  id="groupNumber"
                  value={formData.groupNumber}
                  onChange={(e) => updateFormData("groupNumber", e.target.value)}
                  className="bg-dark-bg-secondary border-gray-600 text-white focus:border-neon-cyan"
                  placeholder="Group number (if applicable)"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Upload Supporting Documents
              </h3>
              <p className="text-gray-400">
                Upload receipts, medical reports, or other supporting documents
              </p>
            </div>
            
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
                dragActive
                  ? "border-neon-cyan bg-neon-cyan/5"
                  : "border-gray-600 hover:border-gray-500"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">
                Drop files here or click to upload
              </h4>
              <p className="text-gray-400 mb-4">
                Supports PDF, JPG, PNG, GIF up to 10MB each
              </p>
              <Button
                type="button"
                variant="outline"
                className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                Choose Files
              </Button>
              <input
                id="fileInput"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>
            
            {/* File List */}
            {formData.files.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-white">Uploaded Files:</h4>
                {formData.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-dark-bg-secondary rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center space-x-3">
                      <File className="h-5 w-5 text-neon-cyan" />
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Review Your Claim
              </h3>
              <p className="text-gray-400">
                Please review all information before submitting
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="h-5 w-5 mr-2 text-neon-cyan" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white ml-2">{formData.patientName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">ID:</span>
                    <span className="text-white ml-2">{formData.patientId}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">DOB:</span>
                    <span className="text-white ml-2">{formData.patientDob}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-neon-green" />
                    Claim Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-gray-400">Service Date:</span>
                    <span className="text-white ml-2">{formData.serviceDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Provider:</span>
                    <span className="text-white ml-2">{formData.provider}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white ml-2">${formData.amount}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-neon-purple" />
                    Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-gray-400">Company:</span>
                    <span className="text-white ml-2">{formData.insuranceCompany}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Policy:</span>
                    <span className="text-white ml-2">{formData.policyNumber}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-neon-orange" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    {formData.files.length} file(s) uploaded
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="text-yellow-500 font-medium">Important Notice</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    By submitting this claim, you certify that all information provided is accurate and complete. 
                    False or fraudulent claims may result in legal action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Submit New Claim</h1>
          <p className="text-gray-400">Follow the steps below to submit your claim</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center space-y-2 transition-all duration-300",
                    isActive && "scale-110"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                      isCompleted
                        ? "bg-neon-green border-neon-green text-dark-bg"
                        : isActive
                        ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                        : "border-gray-600 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isActive ? "text-neon-cyan" : isCompleted ? "text-neon-green" : "text-gray-400"
                      )}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Progress
            value={progress}
            className="h-2 bg-gray-700"
          />
        </div>

        {/* Form Content */}
        <Card className="glass-effect border-gray-700 mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 5 ? (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg hover:shadow-lg hover:shadow-neon-cyan/25"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={submitClaim}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-neon-green to-neon-cyan text-dark-bg hover:shadow-lg hover:shadow-neon-green/25"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <>
                  Submit Claim
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
