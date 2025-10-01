
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { craftReply } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';
import UploadIcon from '../icons/UploadIcon';
import XCircleIcon from '../icons/XCircleIcon';


const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const ReplyCraft: React.FC = () => {
  const [originalPost, setOriginalPost] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
    }
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleSuggest = useCallback(async () => {
    if (!originalPost.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
        let image: { mimeType: string; data: string } | undefined = undefined;
        if (imageFile) {
            const base64Data = await fileToBase64(imageFile);
            image = {
                mimeType: imageFile.type,
                data: base64Data,
            };
        }
      const response = await craftReply({ originalPost, image });
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to craft reply. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalPost, imageFile]);

  return (
    <div>
      <div className="space-y-4">
        <textarea
          value={originalPost}
          onChange={(e) => setOriginalPost(e.target.value)}
          placeholder="Paste the original post you're replying to..."
          className="w-full h-32 p-4 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 shadow-inner placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
        />
        
        {imagePreview ? (
            <div className="relative w-full max-w-sm animate-fade-in">
                <img src={imagePreview} alt="Image preview" className="rounded-lg object-cover w-full h-auto max-h-64 border border-slate-600" />
                <button 
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors"
                    aria-label="Remove image"
                >
                    <XCircleIcon className="w-6 h-6" />
                </button>
            </div>
        ) : (
             <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex justify-center items-center space-x-2 px-4 py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
             >
                <UploadIcon className="w-5 h-5" />
                <span>Add Image (Optional)</span>
            </button>
        )}
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/gif, image/webp"
            className="hidden"
        />
      </div>

      <button
        onClick={handleSuggest}
        disabled={isLoading || !originalPost.trim()}
        className="mt-6 font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-500/40 transform transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Suggesting...' : 'Suggest Replies'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default ReplyCraft;