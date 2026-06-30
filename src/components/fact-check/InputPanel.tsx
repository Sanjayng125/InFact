"use client";

import { useRef, useState } from "react";
import {
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { InputType } from "@/types";
import { Button } from "../ui/button";

const TABS: { type: InputType; label: string; icon: React.ElementType }[] = [
  { type: "text", label: "Text", icon: FileText },
  { type: "url", label: "URL", icon: LinkIcon },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "video", label: "Video", icon: Video },
];

interface InputPanelProps {
  loading: boolean;
  onSubmit: (formData: FormData) => void;
}

export default function InputPanel({ loading, onSubmit }: InputPanelProps) {
  const [inputType, setInputType] = useState<InputType>("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (type: InputType) => {
    setInputType(type);
    setFile(null);
    setTextInput("");
    setUrlInput("");
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("inputType", inputType);

    if (inputType === "text") formData.append("rawInput", textInput);
    else if (inputType === "url") formData.append("rawInput", urlInput);
    else if (file) formData.append("file", file);

    onSubmit(formData);

    clearFile();
  };

  return (
    <div className="rounded-xl bg-surface border border-border-custom overflow-hidden">
      <div className="flex border-b border-border-custom">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = inputType === tab.type;
          return (
            <button
              key={tab.type}
              onClick={() => handleTabChange(tab.type)}
              className={`flex-1 flex items-center justify-center cursor-pointer gap-1.5 py-3 text-xs font-mono transition-colors border-b-2 ${
                active
                  ? "text-accent border-accent"
                  : "text-muted border-transparent hover:text-primary"
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 space-y-4">
        {inputType === "text" && (
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste a claim, paragraph, or article text..."
            rows={8}
            className="w-full bg-background border border-border-custom rounded-lg px-3 py-3 text-sm text-primary placeholder:text-subtle resize-none focus:outline-none focus:border-accent/50 transition-colors"
          />
        )}

        {inputType === "url" && (
          <div className="space-y-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full bg-background border border-border-custom rounded-lg px-3 py-3 text-sm text-primary placeholder:text-subtle focus:outline-none focus:border-accent/50 transition-colors"
            />
            <p className="text-xs text-muted">
              inFact will extract the article content and verify the key claims.
            </p>
          </div>
        )}

        {(inputType === "image" || inputType === "video") && (
          <div>
            {!file ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-lg border border-dashed border-border-custom hover:border-accent/40 transition-colors flex flex-col items-center justify-center gap-2 text-muted hover:text-primary"
              >
                <Upload size={20} />
                <span className="text-xs font-mono">
                  Click to upload {inputType}
                </span>
                <span className="text-xs text-subtle">
                  {inputType === "image"
                    ? "JPG, PNG, WEBP — max 5MB"
                    : "MP4, WEBM, MOV — max 45MB"}
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border-custom">
                <div className="flex items-center gap-2 min-w-0">
                  {inputType === "image" ? (
                    <ImageIcon size={14} className="text-accent shrink-0" />
                  ) : (
                    <Video size={14} className="text-accent shrink-0" />
                  )}
                  <span className="text-xs text-primary truncate">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={clearFile}
                  className="text-muted hover:text-primary transition-colors ml-2 shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={
                inputType === "image"
                  ? "image/jpeg,image/png,image/webp,image/gif"
                  : "video/mp4,video/webm,video/quicktime"
              }
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-lg font-mono bg-accent text-background"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Checking...
            </>
          ) : (
            "Fact-check"
          )}
        </Button>
      </div>
    </div>
  );
}
