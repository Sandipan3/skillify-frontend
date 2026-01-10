import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InstructorVideo = ({ video, replacing, onReplace, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded">
      <div className="p-3 space-y-2">
        {/* Title */}
        <p
          className="font-medium truncate cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        >
          {video.title}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-between">
          {/* Replace */}
          <label className="px-3 py-1 text-sm rounded cursor-pointer bg-blue-600 text-white">
            {replacing ? "Replacing..." : "Replace"}
            <input
              type="file"
              accept="video/*"
              hidden
              disabled={replacing}
              onChange={(e) => onReplace(e.target.files[0])}
            />
          </label>

          {/* Delete */}
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm rounded bg-red-600 text-white"
          >
            Delete
          </button>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="px-3 py-1 text-sm rounded border flex items-center gap-1"
          >
            {open ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{open ? "Hide" : "Show"}</span>
          </button>
        </div>
      </div>

      {/* Video */}
      {open && (
        <div className="border-t p-3">
          {video.url ? (
            <div className="aspect-video bg-black">
              <video key={video.public_id} controls className="w-full h-full">
                <source src={video.url} type="video/mp4" />
              </video>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No video available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorVideo;
