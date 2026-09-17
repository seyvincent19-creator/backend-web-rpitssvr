import { router, useForm } from '@inertiajs/react';
import { ImagePlus, LoaderCircle, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";
const errCls = "mt-1.5 text-xs text-red-500";

interface Video {
    id: number; title: string; creator: string; description: string; duration: string;
    format: string; resolution: string; language: string; upload_date: string;
    tags: string[]; url: string; image: string;
}
interface Props { show: boolean; video: Video; onClose: () => void }

function storageUrl(p: string) {
    if (!p) return '';
    return p.startsWith('/storage') || p.startsWith('storage') ? (p.startsWith('/') ? p : `/${p}`) : `/storage/${p}`;
}

export default function EditVideoModal({ show, video, onClose }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [coverBroken, setCoverBroken] = useState(false);
    const { data, setData, setError, clearErrors, processing, errors } = useForm({
        title: video.title, creator: video.creator, description: video.description,
        duration: video.duration, format: video.format, resolution: video.resolution,
        language: video.language, upload_date: video.upload_date?.slice(0, 10) ?? '',
        tags: (video.tags ?? []).join(', '), url: video.url, image: null as File | null,
    });

    useEffect(() => {
        setData({
            title: video.title, creator: video.creator, description: video.description,
            duration: video.duration, format: video.format, resolution: video.resolution,
            language: video.language, upload_date: video.upload_date?.slice(0, 10) ?? '',
            tags: (video.tags ?? []).join(', '), url: video.url, image: null,
        });
        setCoverBroken(false);
        clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video.id]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && show) onClose(); };
        document.body.style.overflow = show ? 'hidden' : '';
        window.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
    }, [show, onClose]);

    if (!show) return null;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        clearErrors();
        const fd = new FormData();
        fd.append('_method', 'PUT');
        fd.append('title', data.title); fd.append('creator', data.creator);
        fd.append('description', data.description); fd.append('duration', data.duration);
        fd.append('format', data.format); fd.append('resolution', data.resolution);
        fd.append('language', data.language); fd.append('upload_date', data.upload_date);
        fd.append('tags', data.tags); fd.append('url', data.url);
        if (data.image) fd.append('image', data.image);
        router.post(`/videos/${video.id}`, fd, {
            forceFormData: true,
            onSuccess: () => onClose(),
            onError: (errs) => {
                Object.entries(errs).forEach(([key, msg]) =>
                    setError(key as keyof typeof data, msg)
                );
            },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Edit Video</h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className={lbl}>Title</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className={inp} />
                            {errors.title && <p className={errCls}>{errors.title}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className={lbl}>Description</label>
                            <textarea rows={4} value={data.description} onChange={e => setData('description', e.target.value)} className={inp} />
                            {errors.description && <p className={errCls}>{errors.description}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Creator</label>
                            <input type="text" value={data.creator} onChange={e => setData('creator', e.target.value)} className={inp} />
                            {errors.creator && <p className={errCls}>{errors.creator}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Upload Date</label>
                            <input type="date" value={data.upload_date} onChange={e => setData('upload_date', e.target.value)} className={inp} />
                            {errors.upload_date && <p className={errCls}>{errors.upload_date}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Duration</label>
                            <input type="text" value={data.duration} onChange={e => setData('duration', e.target.value)} className={inp} />
                            {errors.duration && <p className={errCls}>{errors.duration}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Format</label>
                            <input type="text" value={data.format} onChange={e => setData('format', e.target.value)} className={inp} />
                            {errors.format && <p className={errCls}>{errors.format}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Resolution</label>
                            <input type="text" value={data.resolution} onChange={e => setData('resolution', e.target.value)} className={inp} />
                            {errors.resolution && <p className={errCls}>{errors.resolution}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Language</label>
                            <input type="text" value={data.language} onChange={e => setData('language', e.target.value)} className={inp} />
                            {errors.language && <p className={errCls}>{errors.language}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className={lbl}>Tags</label>
                            <input type="text" value={data.tags} onChange={e => setData('tags', e.target.value)} className={inp} placeholder="comma, separated, tags" />
                            {errors.tags && <p className={errCls}>{errors.tags}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className={lbl}>Video URL</label>
                            <input type="url" value={data.url} onChange={e => setData('url', e.target.value)} className={inp} />
                            {errors.url && <p className={errCls}>{errors.url}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={lbl}>Thumbnail</label>
                        <div className="flex items-start gap-4">
                            {data.image ? (
                                <img
                                    src={URL.createObjectURL(data.image)}
                                    alt="New thumbnail"
                                    className="w-24 h-16 rounded-lg border object-cover flex-shrink-0"
                                />
                            ) : video.image && !coverBroken ? (
                                <img
                                    src={storageUrl(video.image)}
                                    alt="Current thumbnail"
                                    className="w-24 h-16 rounded-lg border object-cover flex-shrink-0"
                                    onError={() => setCoverBroken(true)}
                                />
                            ) : (
                                <div className="w-24 h-16 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center flex-shrink-0 gap-1">
                                    <ImagePlus className="w-5 h-5 text-gray-300" />
                                    <span className="text-[9px] text-gray-400 text-center leading-tight">No thumbnail</span>
                                </div>
                            )}

                            <div onClick={() => fileRef.current?.click()}
                                className="flex-1 cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-4 text-center">
                                <ImagePlus className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-500">
                                    {video.image && !coverBroken ? 'Click to change thumbnail' : 'Click to upload thumbnail'}
                                </p>
                                <input ref={fileRef} type="file" accept="image/*"
                                    onChange={e => setData('image', e.target.files?.[0] ?? null)} className="hidden" />
                            </div>
                        </div>
                        {coverBroken && !data.image && (
                            <p className="mt-1.5 text-xs text-amber-600">
                                ⚠ Previous thumbnail file is missing — please upload a new one.
                            </p>
                        )}
                        {errors.image && <p className={errCls}>{errors.image}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose} disabled={processing}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-70">
                            {processing ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
