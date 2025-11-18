import React from 'react';
interface FileUploadProps {
    label?: string;
    description?: string;
    accept?: string;
    maxSize?: number;
    value?: File | string | null;
    onChange: (file: File | null) => void;
    preview?: boolean;
    error?: string;
}
export declare const FileUpload: React.FC<FileUploadProps>;
export {};
//# sourceMappingURL=FileUpload.d.ts.map