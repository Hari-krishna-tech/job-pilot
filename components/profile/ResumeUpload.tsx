"use client";

import { useRef, useState, useEffect, type DragEvent } from "react";
import { Upload, FileText, Loader2, Sparkles, Download } from "lucide-react";

type Props = {
  resumeUrl: string | null;
  onFileChange?: (file: File | null) => void;
  onExtract?: () => void;
  extracting?: boolean;
  onGenerate?: () => void;
  generating?: boolean;
};

export function ResumeUpload({ resumeUrl, onFileChange, onExtract, extracting, onGenerate, generating }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    setFileName(resumeUrl ? "resume.pdf" : null);
  }, [resumeUrl]);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      onFileChange?.(file);
    }
  };

  const handleFileSelect = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileChange?.(file);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h2 className="text-base font-semibold leading-6 text-text-primary">
        Resume
      </h2>

      <div
        className={`mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 sm:p-8 transition-colors ${
          dragActive
            ? "border-accent bg-accent-muted"
            : "border-border-muted bg-surface-secondary"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {fileName ? (
          <div className="flex flex-col items-center gap-2">
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light hover:bg-accent transition-colors"
              >
                <FileText className="h-6 w-6 text-accent" />
              </a>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light">
                <FileText className="h-6 w-6 text-accent" />
              </div>
            )}
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-text-primary hover:text-accent transition-colors underline underline-offset-2"
              >
                {fileName}
              </a>
            ) : (
              <p className="text-sm font-medium text-text-primary">{fileName}</p>
            )}
            <div className="flex items-center gap-3">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:opacity-80 transition-opacity"
                >
                  <Download className="h-3 w-3" />
                  Download
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setFileName(null);
                  onFileChange?.(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="text-xs text-text-muted hover:text-error transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-tertiary">
              <Upload className="h-6 w-6 text-text-muted" />
            </div>
            <p className="mt-3 text-sm font-medium text-text-primary">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-text-muted">
              PDF files only (max 5MB)
            </p>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleFileSelect}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors w-full sm:w-auto"
        >
          Select Resume
        </button>
        {fileName && onExtract && (
          <button
            type="button"
            onClick={onExtract}
            disabled={extracting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50 sm:w-auto"
          >
            {extracting && <Loader2 className="h-4 w-4 animate-spin" />}
            {extracting ? "Extracting..." : "Extract from Resume"}
          </button>
        )}
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50 sm:w-auto"
        >
          {generating && <Loader2 className="h-4 w-4 animate-spin" />}
          {!generating && <Sparkles className="h-4 w-4" />}
          {generating ? "Generating..." : "Generate Resume from Profile"}
        </button>
      </div>
    </div>
  );
}
