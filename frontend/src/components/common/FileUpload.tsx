import React, { useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Video, Trash2, Download, Eye, Sparkles } from 'lucide-react';
import { Attachment } from '../../types';
import { detectIssueTypeFromImage } from '../../services/ai';

interface FileUploadProps {
  attachments: Attachment[];
  onUpload: (newAttachments: Attachment[]) => void;
  onRemove: (id: string) => void;
  maxFiles?: number;
  label?: string;
  acceptTypes?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  attachments,
  onUpload,
  onRemove,
  maxFiles = 5,
  label = "Upload Evidence (Photos, Videos, PDFs, Documents)",
  acceptTypes = "image/*,video/mp4,application/pdf"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<Attachment | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: Attachment[] = [];
    Array.from(files).forEach((file) => {
      if (attachments.length + newItems.length >= maxFiles) return;

      const isImg = file.type.startsWith('image/');
      const isVid = file.type.startsWith('video/');
      const isPdf = file.type.includes('pdf');

      let fileType: Attachment['type'] = 'document';
      if (isImg) fileType = 'image';
      else if (isVid) fileType = 'video';
      else if (isPdf) fileType = 'pdf';

      const objectUrl = URL.createObjectURL(file);
      const visionResult = isImg ? detectIssueTypeFromImage(file.name) : undefined;

      newItems.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        url: objectUrl,
        type: fileType,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
        aiVisionDetectedType: visionResult?.label
      });
    });

    onUpload(newItems);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>

      {/* Drag Drop Box */}
      {attachments.length < maxFiles && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition cursor-pointer group shadow-sm ${
            isDragging 
              ? 'border-brand-500 bg-brand-50' 
              : 'border-slate-300 hover:border-brand-400 bg-slate-50/70 hover:bg-slate-100/80'
          }`}
        >
          <input
            type="file"
            multiple
            accept={acceptTypes}
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:border-brand-300 group-hover:text-brand-600 flex items-center justify-center text-slate-500 mb-2 transition">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 text-center">
            Drop evidence files here or <span className="text-brand-600 underline font-bold">browse</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            PNG, JPG, MP4, PDF • Auto AI Vision Feature (Max {maxFiles} files)
          </p>
        </div>
      )}

      {/* Uploaded Attachment List */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-brand-600 font-bold">
                  {att.type === 'image' && <ImageIcon className="w-5 h-5" />}
                  {att.type === 'video' && <Video className="w-5 h-5 text-purple-600" />}
                  {att.type === 'pdf' && <FileText className="w-5 h-5 text-rose-600" />}
                  {att.type === 'document' && <FileText className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 truncate">{att.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{att.size}</p>
                  {att.aiVisionDetectedType && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                      {att.aiVisionDetectedType}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewFile(att)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <a
                  href={att.url}
                  download={att.name}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => onRemove(att.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="text-sm font-bold text-slate-900">{previewFile.name}</h4>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-slate-500 hover:text-slate-900 text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-xl"
              >
                Close Preview
              </button>
            </div>
            <div className="flex items-center justify-center max-h-[60vh] overflow-hidden rounded-2xl bg-slate-950 p-2">
              {previewFile.type === 'image' && (
                <img src={previewFile.url} alt={previewFile.name} className="max-h-[55vh] object-contain rounded-xl" />
              )}
              {previewFile.type === 'video' && (
                <video src={previewFile.url} controls className="max-h-[55vh] w-full rounded-xl" />
              )}
              {previewFile.type === 'pdf' && (
                <iframe src={previewFile.url} title={previewFile.name} className="w-full h-[50vh] rounded-xl" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
