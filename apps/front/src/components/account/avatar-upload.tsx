"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, User, X } from "lucide-react";

import { toast } from "@repo/ui/components/ui/sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";

type Props = {
  name?: string;
  currentAvatar?: string | null;
  userName: string;
  error?: string[];
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const DEFAULT_AVATAR = "/empty_profile.png";

const AvatarUpload = ({
  name = "avatar",
  currentAvatar,
  userName,
  error,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(currentAvatar || DEFAULT_AVATAR);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Profile image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreview(previewUrl);
  };

  const handleRemove = () => {
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview(currentAvatar || DEFAULT_AVATAR);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Avatar preview */}
        <div className="relative shrink-0 w-fit">
          <Avatar className="size-24 border border-border bg-surface-subtle shadow-sm">
            <AvatarImage
              src={preview}
              alt={`${userName}'s profile`}
              className="object-cover"
            />

            <AvatarFallback className="bg-brand-subtle text-brand">
              <User className="size-10" />
            </AvatarFallback>
          </Avatar>

          {selectedFile ? (
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove selected profile photo"
              className="
                absolute -right-1 -top-1
                flex size-7 items-center justify-center
                rounded-full
                border border-border
                bg-background
                text-muted-foreground
                shadow-sm
                transition-colors
                hover:bg-surface-hover
                hover:text-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
              "
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <div
              aria-hidden="true"
              className="
                absolute bottom-0 right-0
                flex size-7 items-center justify-center
                rounded-full
                border border-background
                bg-brand
                text-brand-foreground
                shadow-sm
              "
            >
              <Camera
                className="size-3.5 cursor-pointer"
                onClick={openFilePicker}
              />
            </div>
          )}
        </div>

        {/* Upload control */}
        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            id={name}
            name={name}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleChange}
            className="sr-only"
          />

          <button
            type="button"
            onClick={openFilePicker}
            className="
              group
              flex w-full items-center gap-4
              rounded-xl
              border border-dashed border-border
              bg-surface-subtle/50
              px-4 py-4
              text-left
              transition-colors
              hover:border-brand/50
              hover:bg-brand-subtle/40
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              sm:max-w-md
              cursor-pointer
            "
          >
            <span
              className="
                flex size-10 shrink-0 items-center justify-center
                rounded-lg
                bg-brand-subtle
                text-brand
                transition-colors
                group-hover:bg-brand
                group-hover:text-brand-foreground
              "
            >
              <ImagePlus className="size-5" />
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">
                {selectedFile
                  ? "Choose a different photo"
                  : "Upload a profile photo"}
              </span>

              <span className="mt-1 block truncate text-xs text-muted-foreground">
                {selectedFile
                  ? selectedFile.name
                  : "JPG, PNG, or WebP · Max 5MB"}
              </span>
            </span>
          </button>

          {selectedFile && (
            <p className="mt-2 text-xs text-brand">
              New photo selected. Save your profile to apply it.
            </p>
          )}

          {error?.map((message) => {
            return (
              <p key={message} className="mt-2 text-xs text-destructive">
                {message}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
