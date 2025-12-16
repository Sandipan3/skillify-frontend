import React from "react";
import ReactPlayer from "react-player";

const InstructorVideo = ({ video, replacing, onReplace, onDelete }) => {
  return (
    <div className="border rounded p-4 space-y-3">
      {/* TOP ROW */}
      <div className="grid grid-cols-5 items-center gap-4">
        {/* Title */}
        <p className="font-medium col-span-3 truncate">{video.title}</p>

        {/* Replace */}
        <div className="col-span-1 flex justify-center">
          <label className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer text-sm">
            {replacing ? "Replacing..." : "Replace"}
            <input
              type="file"
              accept="video/*"
              hidden
              disabled={replacing}
              onChange={(e) => onReplace(e.target.files[0])}
            />
          </label>
        </div>

        {/* Delete */}
        <div className="col-span-1 flex justify-center">
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* VIDEO PLAYER */}
      <div className="col-span-5 rounded overflow-hidden aspect-video bg-black">
        <ReactPlayer
          url={video.url}
          controls
          width="100%"
          height="100%"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
};

export default InstructorVideo;
