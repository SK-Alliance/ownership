'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRegistrationStore } from '@/lib/stores/registration-store';
import { Upload, FileText, CreditCard, Plus, X, Check } from 'lucide-react';
import { useCallback, useState } from 'react';

interface FileUploadProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  file?: File;
  onFileSelect: (file: File | undefined) => void;
  required?: boolean;
}

function FileUpload({ label, description, icon, file, onFileSelect, required }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const removeFile = useCallback(() => {
    onFileSelect(undefined);
  }, [onFileSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      <Label className="text-main font-medium flex items-center gap-2">
        {icon}
        {label} {required && '*'}
      </Label>
      
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer
            ${isDragOver 
              ? 'border-gold bg-gold/5' 
              : 'border-main/30 hover:border-gold/50 hover:bg-gold/5'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-${label.replace(/\s+/g, '-').toLowerCase()}`)?.click()}
        >
          <Upload className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="text-main font-medium mb-1">Drop file here or click to upload</p>
          <p className="text-sm text-muted mb-3">{description}</p>
          <p className="text-xs text-muted">Supports: PDF, JPG, PNG (Max 10MB)</p>
          
          <input
            id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-green/5 border border-green/20 rounded-lg">
          <div className="w-10 h-10 bg-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-green" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-main truncate">{file.name}</p>
            <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            onClick={removeFile}
            className="w-8 h-8 bg-red/20 hover:bg-red/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-red" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function UploadProofStep() {
  const { proofFiles, updateProofFiles } = useRegistrationStore();

  const handleReceiptUpload = (file: File | undefined) => {
    updateProofFiles({ receipt: file });
  };

  const handleIdUpload = (file: File | undefined) => {
    updateProofFiles({ identification: file });
  };

  const handleAdditionalUpload = (file: File) => {
    const newDocs = [...proofFiles.additionalDocs, file];
    updateProofFiles({ additionalDocs: newDocs });
  };

  const removeAdditionalDoc = (index: number) => {
    const newDocs = proofFiles.additionalDocs.filter((_, i) => i !== index);
    updateProofFiles({ additionalDocs: newDocs });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-main/20 bg-surface/50 backdrop-blur-md">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue/30"
          >
            <Upload className="w-8 h-8 text-blue" />
          </motion.div>
          <CardTitle className="text-2xl font-clash text-main">
            Upload Proof
          </CardTitle>
          <CardDescription className="text-muted">
            Provide documentation to verify your ownership
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Receipt Upload */}
          <FileUpload
            label="Purchase Receipt"
            description="Upload your receipt, invoice, or proof of purchase"
            icon={<FileText className="w-4 h-4 text-gold" />}
            file={proofFiles.receipt}
            onFileSelect={handleReceiptUpload}
            required
          />

          {/* ID Upload */}
          <FileUpload
            label="Identification"
            description="Upload a government-issued ID for verification"
            icon={<CreditCard className="w-4 h-4 text-blue" />}
            file={proofFiles.identification}
            onFileSelect={handleIdUpload}
            required
          />

          {/* Additional Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            <Label className="text-main font-medium flex items-center gap-2">
              <Plus className="w-4 h-4 text-green" />
              Additional Documents (Optional)
            </Label>
            
            {proofFiles.additionalDocs.length > 0 && (
              <div className="space-y-3">
                {proofFiles.additionalDocs.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-surface/50 border border-main/20 rounded-lg">
                    <div className="w-8 h-8 bg-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-main truncate">{file.name}</p>
                      <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => removeAdditionalDoc(index)}
                      className="w-6 h-6 bg-red/20 hover:bg-red/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3 text-red" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className="border-2 border-dashed border-main/30 hover:border-green/50 hover:bg-green/5 rounded-lg p-4 text-center transition-all duration-300 cursor-pointer"
              onClick={() => document.getElementById('additional-files')?.click()}
            >
              <Plus className="w-6 h-6 text-muted mx-auto mb-2" />
              <p className="text-sm text-main font-medium">Add More Documents</p>
              <p className="text-xs text-muted">Warranty, certificates, appraisals, etc.</p>
              
              <input
                id="additional-files"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleAdditionalUpload(files[0]);
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex items-start gap-3 p-4 bg-blue/5 border border-blue/20 rounded-lg"
          >
            <div className="w-6 h-6 bg-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Upload className="w-3 h-3 text-blue" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-main">Secure Upload</p>
              <p className="text-xs text-muted">
                Your documents are encrypted and stored securely. We only use them for verification purposes.
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
