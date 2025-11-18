import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
export const FileUpload = ({ label, description, accept = 'image/*', maxSize = 5 * 1024 * 1024, // 5MB default
value, onChange, preview = true, error, }) => {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(typeof value === 'string' ? value : null);
    const handleFile = (file) => {
        if (file.size > maxSize) {
            alert(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
            return;
        }
        onChange(file);
        if (preview && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        }
        else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };
    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };
    const handleRemove = () => {
        onChange(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: label })), description && (_jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-2", children: description })), previewUrl ? (_jsxs("div", { className: "relative inline-block", children: [_jsx("img", { src: previewUrl, alt: "Preview", className: "w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600" }), _jsx("button", { type: "button", onClick: handleRemove, className: "absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors", children: _jsx(X, { className: "w-4 h-4" }) })] })) : (_jsxs(motion.div, { onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop, className: cn('relative border-2 border-dashed rounded-lg p-6 text-center transition-colors', dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50', error && 'border-red-500'), whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: [_jsx("input", { ref: fileInputRef, type: "file", accept: accept, onChange: handleChange, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer" }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center", children: accept.includes('image') ? (_jsx(ImageIcon, { className: "w-6 h-6 text-gray-500" })) : (_jsx(Upload, { className: "w-6 h-6 text-gray-500" })) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Click to upload or drag and drop" }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: ["Max size: ", (maxSize / 1024 / 1024).toFixed(0), "MB"] })] })] })] })), error && (_jsx("p", { className: "mt-1.5 text-xs text-red-500", children: error }))] }));
};
//# sourceMappingURL=FileUpload.js.map