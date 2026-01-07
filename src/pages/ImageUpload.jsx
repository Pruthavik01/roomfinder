import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

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
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFiles([...e.target.files])}
      />
      <br />
      <button onClick={uploadImages} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Images'}
      </button>
    </div>
  );
}
