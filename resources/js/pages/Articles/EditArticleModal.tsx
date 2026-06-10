import React, { useEffect, useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";

interface User {
  id: number;
  name: string;
}

interface Image {
  id: number;
  image_path: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  status: string;
  user_id: number;
  thumbnail?: string;
  images?: Image[];
}

interface Props {
  show: boolean;
  onClose: () => void;
  article: Article;
  users: User[];
}

function toDatetimeLocal(dtstr: string | undefined) {
  if (!dtstr) return "";
  const date = new Date(dtstr);
  return date.toISOString().slice(0, 16);
}

export default function EditArticleModal({ show, onClose, article, users }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, setData, errors, setError, clearErrors, reset } = useForm({
    title: article.title || "",
    content: article.content || "",
    created_at: toDatetimeLocal(article.created_at) || new Date().toISOString().slice(0, 16),
    updated_at: toDatetimeLocal(article.updated_at) || new Date().toISOString().slice(0, 16),
    status: article.status || "draft",
    user: article.user_id || "",
    thumbnail: null as File | null,
    images: [] as File[],
    remove_images: [] as number[],
  });

  const storageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("/storage") || path.startsWith("storage")) {
      return path.startsWith("/") ? path : `/${path}`;
    }
    return `/storage/${path}`;
  };

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    article.thumbnail ? storageUrl(article.thumbnail) : null
  );

  const [imagePreviews, setImagePreviews] = useState<Image[]>(
    (article.images || []).map(img => ({
      ...img,
      image_path: storageUrl(img.image_path),
    }))
  );

  useEffect(() => {
    clearErrors();
    setData({
      title: article.title || "",
      content: article.content || "",
      created_at: toDatetimeLocal(article.created_at) || new Date().toISOString().slice(0, 16),
      updated_at: toDatetimeLocal(article.updated_at) || new Date().toISOString().slice(0, 16),
      status: article.status || "draft",
      user: article.user_id || "",
      thumbnail: null,
      images: [],
      remove_images: [],
    });
    setThumbnailPreview(article.thumbnail ? storageUrl(article.thumbnail) : null);
    setImagePreviews(
      (article.images || []).map(img => ({
        ...img,
        image_path: storageUrl(img.image_path),
      }))
    );
  }, [article]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setData("thumbnail", file);
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const now = Date.now();
    setData("images", [...data.images, ...files]);
    setImagePreviews(prev => [
      ...prev,
      ...files.map((file, i) => ({
        id: -(now + i + 1),
        image_path: URL.createObjectURL(file),
      })),
    ]);
  };

  // Drag and drop support
  const imageDropRef = useRef<HTMLDivElement>(null);

  const handleImagesDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    if (files.length) {
      const now = Date.now();
      setData("images", [...data.images, ...files]);
      setImagePreviews(prev => [
        ...prev,
        ...files.map((file, i) => ({
          id: -(now + i + 1),
          image_path: URL.createObjectURL(file),
        })),
      ]);
    }
  };

  const handleImagesDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = (id: number) => {
    if (id > 0) {
      // Existing DB image — queue for deletion on server
      setData("remove_images", [...data.remove_images, id]);
      setImagePreviews(prev => prev.filter(img => img.id !== id));
    } else {
      // Newly added file (negative id) — remove from local state only
      const newFilesOnly = imagePreviews.filter(img => img.id <= 0);
      const newFileIndex = newFilesOnly.findIndex(img => img.id === id);
      if (newFileIndex !== -1) {
        setData("images", data.images.filter((_, i) => i !== newFileIndex));
      }
      setImagePreviews(prev => prev.filter(img => img.id !== id));
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title", data.title || "");
    formData.append("content", data.content || "");
    formData.append("status", data.status || "");
    formData.append("created_at", data.created_at || "");
    formData.append("updated_at", data.updated_at || "");
    formData.append("user", String(data.user || ""));

    if (data.thumbnail instanceof File) {
      formData.append("thumbnail", data.thumbnail);
    }

    data.images.forEach((file) => {
      if (file instanceof File) formData.append("images[]", file);
    });

    data.remove_images.forEach((id) => {
      formData.append("remove_images[]", String(id));
    });

    setIsSubmitting(true);
    router.post(`/articles/${article.id}`, formData, {
      forceFormData: true,
      onSuccess: () => {
        clearErrors();
        reset();
        onClose();
        setIsSubmitting(false);
      },
      onError: (errs) => {
        clearErrors();
        Object.entries(errs).forEach(([field, message]) => {
          setError(field as keyof typeof data, message);
        });
        setIsSubmitting(false);
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Article</h2>
        <form onSubmit={submit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: text fields */}
            <div className="space-y-6">
              <div>
                <label>Title</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={e => setData("title", e.target.value)}
                  className="w-full border rounded p-2"
                />
                {errors.title && <p className="text-red-500">{errors.title}</p>}
              </div>
              <div>
                <label>Content</label>
                <textarea
                  value={data.content}
                  onChange={e => setData("content", e.target.value)}
                  className="w-full border rounded p-2"
                  rows={6}
                />
                {errors.content && <p className="text-red-500">{errors.content}</p>}
              </div>
              <div>
                <label>Created At</label>
                <input
                  type="datetime-local"
                  value={data.created_at}
                  onChange={e => setData("created_at", e.target.value)}
                  className="w-full border rounded p-2"
                />
                {errors.created_at && <p className="text-red-500">{errors.created_at}</p>}
              </div>
              <div>
                <label>Updated At</label>
                <input
                  type="datetime-local"
                  value={data.updated_at}
                  onChange={e => setData("updated_at", e.target.value)}
                  className="w-full border rounded p-2"
                />
                {errors.updated_at && <p className="text-red-500">{errors.updated_at}</p>}
              </div>
            </div>
            {/* Column 2: status, user, thumbnail, images */}
            <div className="space-y-6">
              <div>
                <label>Status</label>
                <select
                  value={data.status}
                  onChange={e => setData("status", e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                {errors.status && <p className="text-red-500">{errors.status}</p>}
              </div>
              <div>
                <label>User</label>
                <select
                  value={data.user}
                  onChange={e => setData("user", e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">-- Select User --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                {errors.user && <p className="text-red-500">{errors.user}</p>}
              </div>
              <div>
                <label>Thumbnail</label>
                {thumbnailPreview && (
                  <div className="mb-2">
                    <img src={thumbnailPreview} alt="Thumbnail" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full" />
                {errors.thumbnail && <p className="text-red-500">{errors.thumbnail}</p>}
              </div>
              <div>
                <label>Images</label>
                {/* Drag and drop area */}
                <div
                  ref={imageDropRef}
                  onDrop={handleImagesDrop}
                  onDragOver={handleImagesDragOver}
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 cursor-pointer transition mb-3"
                  onClick={() => {
                    // Open file picker when user clicks the drop area
                    const input = document.createElement("input");
                    input.type = "file";
                    input.multiple = true;
                    input.accept = "image/*";
                    input.onchange = handleImagesChange as any;
                    input.click();
                  }}
                >
                  <span className="text-gray-400 mb-2">
                    Drag &amp; drop images here or click to select
                  </span>
                  <span className="text-xs text-gray-400">
                    Recommended: PNG/JPG, max 2MB each
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mb-2">
                  {imagePreviews.map((img, i) => (
                    <div key={img.id} className="relative">
                      <img src={img.image_path} className="w-24 h-24 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {errors.images && <p className="text-red-500">{errors.images}</p>}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="bg-gray-300 px-5 py-2 rounded">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-5 py-2 rounded">
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
