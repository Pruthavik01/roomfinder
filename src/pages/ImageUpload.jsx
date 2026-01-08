import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Upload as UploadIcon, Image as ImageIcon } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function ImageUpload({ roomId, onDone }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const uploadImages = async () => {
    if (!files.length) return;

    setUploading(true);

    try {
      for (let file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${roomId}/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('room-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save path to DB
        const { error: dbError } = await supabase
          .from('room_images')
          .insert({
            room_id: roomId,
            image_path: filePath
          });

        if (dbError) throw dbError;
      }

      alert('Images uploaded successfully');
      setFiles([]);
      onDone && onDone();

    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        icon={ImageIcon}
        type="file"
        multiple
        accept="image/*"
        label="Upload Room Images"
        onChange={(e) => setFiles([...e.target.files])}
      />
      {files.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">{files.length} file(s) selected</p>
        </div>
      )}
      <Button
        onClick={uploadImages}
        disabled={uploading || !files.length}
        isLoading={uploading}
        variant="primary"
        size="md"
        className="w-full"
      >
        <UploadIcon className="w-4 h-4 mr-2" />
        {uploading ? 'Uploading Images...' : 'Upload Images'}
      </Button>
    </div>
  );
}
