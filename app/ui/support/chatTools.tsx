import React from 'react';

export default function ChatTools({
  onFileUpload,
}: {
  onFileUpload: (file: File) => void;
}) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileUpload(event.target.files[0]);
    }
  };

  return (
    <div className="flex items-center border-b border-gray-300 bg-gray-100 p-2">
      <button className="mx-2 rounded p-2 hover:bg-gray-200">
        <span role="img" aria-label="Emoji">
          😊
        </span>
      </button>
      <button className="mx-2 rounded p-2 hover:bg-gray-200">
        <label htmlFor="file-upload" className="cursor-pointer">
          📎
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </button>
      {/* 其他工具按钮 */}
    </div>
  );
}
