'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Upload, 
  FileText, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Zap,
  CheckCircle,
  Info
} from 'lucide-react';

interface Step3Props {
  formData: {
    billFile: File | null;
    idFile: File | null;
  };
  userCredits: number;
  onFormDataChange: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
  onVerifyDocuments: () => Promise<{ success: boolean; message?: string }>;
  isVerifying: boolean;
}

export const Step3IPCreation: React.FC<Step3Props> = ({
  formData,
  userCredits = 5,
  onFormDataChange,
  onBack,
  onNext,
  onVerifyDocuments,
  isVerifying
}) => {
  const [billPreview, setBillPreview] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [verificationStarted, setVerificationStarted] = useState(false);

  const handleFileUpload = (field: 'billFile' | 'idFile', file: File) => {
    onFormDataChange({ ...formData, [field]: file });
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (field === 'billFile') {
        setBillPreview(result);
      } else {
        setIdPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVerifyAndContinue = async () => {
    setVerificationStarted(true);
    try {
      const result = await onVerifyDocuments();
      if (result.success) {
        onNext();
      }
      // Error handling is done in parent component
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  const canProceed = formData.billFile && formData.idFile && userCredits > 0;

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green/20 to-green/10 border border-green/30">
          <Shield className="w-8 h-8 text-green" />
        </div>
        <h2 className="text-2xl font-bold text-main mb-2">IP Certificate Creation</h2>
        <p className="text-muted">Upload verification documents for authenticity check</p>
      </div>

      {/* Credits Info */}
      <div className="max-w-md mx-auto">
        <div className="p-4 bg-gradient-to-r from-green/5 to-green/10 border border-green/20 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-green" />
            <h3 className="font-semibold text-main">IP Creation Credits</h3>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Available Credits:</span>
            <Badge className="bg-green/20 text-green border-green/30">
              {userCredits} credits
            </Badge>
          </div>
          <div className="text-xs text-muted space-y-1">
            <p>• Get 5 free credits per month</p>
            <p>• AI-powered document verification</p>
            <p>• Enhanced ownership protection</p>
            <p>• Legal-grade authenticity proof</p>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Bill/Receipt Upload */}
        <div>
          <label className="block text-sm font-medium text-main mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Purchase Receipt/Bill *
          </label>
          <div className="relative">
            {billPreview ? (
              <div className="relative rounded-lg border-2 border-dashed border-green/30 p-4">
                <img
                  src={billPreview}
                  alt="Bill preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => document.getElementById('bill-upload')?.click()}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <label
                htmlFor="bill-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green/30 rounded-lg cursor-pointer hover:border-green/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-green mb-2" />
                <span className="text-main font-medium">Upload Purchase Receipt</span>
                <span className="text-muted text-sm">PDF, PNG, JPG up to 10MB</span>
              </label>
            )}
            <input
              id="bill-upload"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('billFile', file);
              }}
              className="hidden"
              required
            />
          </div>
        </div>

        {/* ID Document Upload */}
        <div>
          <label className="block text-sm font-medium text-main mb-2">
            <CreditCard className="w-4 h-4 inline mr-2" />
            Identity Document *
          </label>
          <div className="relative">
            {idPreview ? (
              <div className="relative rounded-lg border-2 border-dashed border-green/30 p-4">
                <img
                  src={idPreview}
                  alt="ID preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => document.getElementById('id-upload')?.click()}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <label
                htmlFor="id-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green/30 rounded-lg cursor-pointer hover:border-green/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-green mb-2" />
                <span className="text-main font-medium">Upload Identity Document</span>
                <span className="text-muted text-sm">Driver's License, Passport, etc.</span>
              </label>
            )}
            <input
              id="id-upload"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('idFile', file);
              }}
              className="hidden"
              required
            />
          </div>
        </div>

        {/* Info Message */}
        <div className="flex items-start gap-3 p-4 bg-blue/5 border border-blue/20 rounded-lg">
          <Info className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-main font-medium mb-1">Document Verification Process</p>
            <p className="text-muted">
              Our AI system will verify the authenticity of your documents and cross-reference 
              ownership details. This process typically takes 30-60 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-main/10">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="px-6 py-3 border-main/20 text-main hover:border-main/40"
          disabled={isVerifying}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          type="button"
          onClick={handleVerifyAndContinue}
          disabled={!canProceed || isVerifying}
          className="px-8 py-3 bg-gradient-to-r from-green to-green/80 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green/25 transition-all duration-200 disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying Documents...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Verify & Create IP Certificate
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
