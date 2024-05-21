import React, {
  KeyboardEvent,
  FC,
  ClipboardEvent,
  useRef,
  useState,
} from 'react';

interface InputAreaProps {
  placeholder?: string;
  onSend: (content: Array<{ type: string; content: string }>) => void;
}

const InputArea: FC<InputAreaProps> = ({
  placeholder = '有问题尽管问',
  onSend,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pastedImage, setPastedImage] = useState<string | null>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (contentRef.current) {
      const contentElements = contentRef.current.childNodes;
      const contentArray: Array<{ type: string; content: string }> = [];

      contentElements.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          contentArray.push({ type: 'text', content: node.textContent || '' });
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).tagName === 'IMG'
        ) {
          contentArray.push({
            type: 'image',
            content: (node as HTMLImageElement).src,
          });
        }
      });

      if (contentArray.length > 0) {
        onSend(contentArray);
        contentRef.current.innerHTML = ''; // 清空内容
        setPastedImage(null); // 清空图片预览
      }
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              const imageBase64 = e.target.result as string;
              setPastedImage(imageBase64);
              if (contentRef.current) {
                const img = document.createElement('img');
                img.src = imageBase64;
                contentRef.current.appendChild(img);
              }
            }
          };
          reader.readAsDataURL(file);
        }
        event.preventDefault();
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center rounded-md border border-gray-300 p-2 shadow-md">
      <div
        ref={contentRef}
        className="w-full flex-1 rounded border-none p-2 text-gray-700 focus:outline-none"
        contentEditable
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        style={{ minHeight: '10rem', maxHeight: '20rem', overflowY: 'auto' }}
      />
      <button
        className="focus:shadow-outline absolute bottom-2 right-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
        onClick={handleSend}
      >
        发送
      </button>
    </div>
  );
};

export default InputArea;
