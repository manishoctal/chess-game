import { useState } from 'react';
import { t } from 'i18next';
export default function ImageUploader({ onFileChange ,defaultImage}) {
    const [imageSrc, setImageSrc] = useState(defaultImage||null);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target.result);
                if (onFileChange) {
                    onFileChange(file);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const removeImage = () => {
        setImageSrc(null);
        if (onFileChange) {
            onFileChange(null);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto mt-3 p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Upload Banner Image
                </label>
                <div
                    className="flex items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
                    onClick={() => document.getElementById('fileInput').click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-blue-500');
                    }}
                    onDragLeave={(e) => e.currentTarget.classList.remove('border-blue-500')}
                    onDrop={handleDrop}
                >
                    <p className="text-gray-500">{t('DRAG_AND_DROP_IMAGE')}</p>
                    <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>
            </div>
            {imageSrc && (
                <div className="mt-4 relative">
                    <p className="text-gray-700 text-sm font-bold mb-2">{t('SELECT_IMAGE_TO_PREVIEW')}</p>
                    <img src={imageSrc} alt="Image Preview" className="w-full h-auto rounded-lg shadow-lg" />
                    <button
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        onClick={removeImage}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                        </svg>

                    </button>
                </div>
            )}
        </div>
    );
}
