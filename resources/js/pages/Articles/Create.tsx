import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ImagePlus, LoaderCircle, X } from 'lucide-react';
import React, { useRef } from 'react';

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";
const err = "mt-1.5 text-xs text-red-500";

export default function Create() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const thumbRef = useRef<HTMLInputElement>(null);
    const auth = (usePage().props as { auth?: { user: { id: number; name: string } } }).auth;
    if (!auth) throw new Error('Auth user not found.');

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        thumbnail: null as File | null,
        images: [] as File[],
        user: auth.user.id.toString(),
        post_date: new Date().toISOString().slice(0, 10),
        status: 'published',
    });

    const addImages = (files: File[]) => setData('images', [...data.images, ...files.filter(f => f.type.startsWith('image/'))]);
    const removeImage = (i: number) => { const n = [...data.images]; n.splice(i, 1); setData('images', n); };

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const fd = new FormData();
        fd.append('title', data.title);
        fd.append('content', data.content);
        fd.append('post_date', data.post_date);
        fd.append('status', data.status);
        fd.append('user', data.user);
        if (data.thumbnail) fd.append('thumbnail', data.thumbnail);
        data.images.forEach((f, i) => fd.append(`images[${i}]`, f));
        post('/articles', { data: fd, forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Articles', href: '/articles' }, { title: 'Create', href: '#' }]}>
            <Head title="Create Article" />
            <div className="p-4 md:p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">New Article</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to publish a new article</p>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                                <h2 className="text-sm font-semibold text-gray-700">Article Details</h2>
                                <div>
                                    <label className={lbl}>Title <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="Enter article title" value={data.title}
                                        onChange={e => setData('title', e.target.value)} className={inp} />
                                    {errors.title && <p className={err}>{errors.title}</p>}
                                </div>
                                <div>
                                    <label className={lbl}>Content <span className="text-red-500">*</span></label>
                                    <textarea placeholder="Write article content…" value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        rows={8} className={inp + ' resize-none'} />
                                    {errors.content && <p className={err}>{errors.content}</p>}
                                </div>
                            </div>

                            {/* Additional images */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 mb-3">Article Images</h2>
                                <div
                                    onDrop={e => { e.preventDefault(); addImages(Array.from(e.dataTransfer.files)); }}
                                    onDragOver={e => e.preventDefault()}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-6 text-center"
                                >
                                    <ImagePlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Drag & drop or <span className="text-blue-600 font-medium">click to browse</span></p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB each</p>
                                    <input ref={fileInputRef} type="file" multiple accept="image/*"
                                        onChange={e => addImages(Array.from(e.target.files ?? []))} className="hidden" />
                                </div>
                                {data.images.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {data.images.map((file, i) => (
                                            <div key={i} className="relative group">
                                                <img src={URL.createObjectURL(file)} alt=""
                                                    className="h-24 w-full rounded-xl border object-cover" />
                                                <button type="button" onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.images && <p className={err}>{errors.images}</p>}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-5">
                            {/* Thumbnail */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 mb-3">Thumbnail</h2>
                                <div onClick={() => thumbRef.current?.click()}
                                    className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
                                    {data.thumbnail ? (
                                        <img src={URL.createObjectURL(data.thumbnail)} alt=""
                                            className="w-full aspect-video object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8">
                                            <ImagePlus className="w-8 h-8 text-gray-300 mb-2" />
                                            <p className="text-xs text-gray-500 text-center">Click to upload thumbnail</p>
                                        </div>
                                    )}
                                </div>
                                <input ref={thumbRef} type="file" accept="image/*"
                                    onChange={e => setData('thumbnail', e.target.files?.[0] || null)} className="hidden" />
                                {errors.thumbnail && <p className={err}>{errors.thumbnail}</p>}
                            </div>

                            {/* Settings */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                                <h2 className="text-sm font-semibold text-gray-700">Settings</h2>
                                <div>
                                    <label className={lbl}>Status</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className={inp}>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={lbl}>Post Date</label>
                                    <input type="date" value={data.post_date}
                                        onChange={e => setData('post_date', e.target.value)} className={inp} />
                                </div>
                                <div>
                                    <label className={lbl}>Posted By</label>
                                    <input type="text" value={auth.user.name} disabled
                                        className={inp + ' bg-gray-50 cursor-not-allowed text-gray-500'} />
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                {processing ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Saving…</> : 'Publish Article'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
