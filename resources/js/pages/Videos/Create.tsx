import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { ChangeEvent, FormEvent, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";
const err = "mt-1.5 text-xs text-red-500";

type VideoForm = {
    title: string; creator: string; description: string; duration: string; format: string;
    resolution: string; language: string; upload_date: string; tags: string; url: string; image: File | null;
};

export default function Create() {
    const fileRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, reset } = useForm<VideoForm>({
        title: '', creator: '', description: '', duration: '', format: '', resolution: '',
        language: '', upload_date: '', tags: '', url: '', image: null,
    });

    const handle = (field: keyof VideoForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData(field, e.target.value);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('title', data.title); fd.append('creator', data.creator);
        fd.append('description', data.description); fd.append('duration', data.duration);
        fd.append('format', data.format); fd.append('resolution', data.resolution);
        fd.append('language', data.language); fd.append('upload_date', data.upload_date);
        fd.append('tags', data.tags); fd.append('url', data.url);
        if (data.image) fd.append('image', data.image);
        post('/videos', {
            data: fd, forceFormData: true,
            onSuccess: () => { toast.success('Video saved!'); reset(); },
            onError: () => toast.error('Failed to save video.'),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Videos', href: '/videos' }, { title: 'Create', href: '#' }]}>
            <Head title="Create Video" />
            <Toaster position="top-right" />
            <div className="p-4 md:p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">New Video</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Add a new video to the library</p>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                                <h2 className="text-sm font-semibold text-gray-700">Video Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className={lbl}>Title <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Video title" value={data.title} onChange={handle('title')} className={inp} />
                                        {errors.title && <p className={err}>{errors.title}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={lbl}>Description <span className="text-red-500">*</span></label>
                                        <textarea placeholder="Description" rows={4} value={data.description} onChange={handle('description')} className={inp} />
                                        {errors.description && <p className={err}>{errors.description}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Creator <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Creator name" value={data.creator} onChange={handle('creator')} className={inp} />
                                        {errors.creator && <p className={err}>{errors.creator}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Upload Date</label>
                                        <input type="date" value={data.upload_date} onChange={handle('upload_date')} className={inp} />
                                        {errors.upload_date && <p className={err}>{errors.upload_date}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Duration</label>
                                        <input type="text" placeholder="e.g. 12:34" value={data.duration} onChange={handle('duration')} className={inp} />
                                        {errors.duration && <p className={err}>{errors.duration}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Format</label>
                                        <input type="text" placeholder="e.g. MP4" value={data.format} onChange={handle('format')} className={inp} />
                                        {errors.format && <p className={err}>{errors.format}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Resolution</label>
                                        <input type="text" placeholder="e.g. 1080p" value={data.resolution} onChange={handle('resolution')} className={inp} />
                                        {errors.resolution && <p className={err}>{errors.resolution}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Language</label>
                                        <input type="text" placeholder="e.g. Khmer, English" value={data.language} onChange={handle('language')} className={inp} />
                                        {errors.language && <p className={err}>{errors.language}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={lbl}>Tags</label>
                                        <input type="text" placeholder="comma, separated, tags" value={data.tags} onChange={handle('tags')} className={inp} />
                                        {errors.tags && <p className={err}>{errors.tags}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={lbl}>Video URL</label>
                                        <input type="url" placeholder="https://…" value={data.url} onChange={handle('url')} className={inp} />
                                        {errors.url && <p className={err}>{errors.url}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 mb-3">Thumbnail</h2>
                                <div onClick={() => fileRef.current?.click()}
                                    className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
                                    {data.image ? (
                                        <img src={URL.createObjectURL(data.image)} alt=""
                                            className="w-full aspect-video object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 aspect-video">
                                            <ImagePlus className="w-8 h-8 text-gray-300 mb-2" />
                                            <p className="text-xs text-gray-500 text-center">Click to upload thumbnail</p>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept="image/*"
                                    onChange={e => setData('image', e.target.files?.[0] ?? null)} className="hidden" />
                                {errors.image && <p className={err}>{errors.image}</p>}
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                {processing ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Video'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
