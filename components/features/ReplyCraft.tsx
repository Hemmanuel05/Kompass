
import React, { useState, useCallback } from 'react';
import { craftReply } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';
import UploadIcon from '../icons/UploadIcon';
import XCircleIcon from '../icons/XCircleIcon';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = (reader.result as string).split(',')[1];
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as base64."));
      }
    };
    reader.onerror = (error) => reject(error);
  });


const ReplyCraft: React.FC = () => {
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState<{ file: File, preview: string, base64: string, mimeType: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        setImage({
          file,
          preview: URL.createObjectURL(file),
          base64,
          mimeType: file.type
        });
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image.preview);
      setImage(null);
    }
  };

  const handleSuggest = useCallback(async () => {
    if (!postText.trim()) return;
    
    setIsLoading(true);
    setResult('');
    try {
      const response = await craftReply({ 
        postText,
        image: image ? { data: image.base64, mimeType: image.mimeType } : undefined
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to craft reply. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [postText, image]);

  return (
    <div>
      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="Paste the original post text here..."
        className="w-full h-32 p-4 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 shadow-inner placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
      />

      <div className="mt-4">
        {image ? (
          <div className="relative inline-block">
            <img src={image.preview} alt="Post preview" className="h-24 w-auto rounded-lg border border-slate-700" />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              aria-label="Remove image"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div>
            <label htmlFor="image-upload" className="inline-flex items-center px-4 py-2 border border-slate-700 text-sm font-medium rounded-md text-slate-400 bg-slate-900/70 hover:bg-slate-800 cursor-pointer transition-colors">
              <UploadIcon className="w-5 h-5 mr-2" />
              Upload Image (Optional)
            </label>
            <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>
        )}
      </div>

      <button
        onClick={handleSuggest}
        disabled={isLoading || !postText.trim()}
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
