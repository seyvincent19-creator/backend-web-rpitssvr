import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ImagePlus, LoaderCircle, PlusCircle, X } from 'lucide-react';
import React, { useRef } from 'react';

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";
const err = "mt-1.5 text-xs text-red-500";

export default function Create() {
    const slideRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        title_khmer: '', title_eng: '', description: '',
        skills: [''] as string[],
        slideImages: [] as File[],
        descriptionImages: [] as File[],
        post_date: new Date().toISOString().slice(0, 10),
    });

    const handleSkill = (i: number, v: string) => {
        const n = [...data.skills]; n[i] = v; setData('skills', n);
    };
    const addSkill = () => setData('skills', [...data.skills, '']);
    const removeSkill = (i: number) => {
        const n = data.skills.filter((_, idx) => idx !== i);
        setData('skills', n.length ? n : ['']);
    };

    const addSlides = (files: File[]) => setData('slideImages', [...data.slideImages, ...files.filter(f => f.type.startsWith('image/'))]);
    const removeSlide = (i: number) => { const n = [...data.slideImages]; n.splice(i, 1); setData('slideImages', n); };

    const addDescs = (files: File[]) => setData('descriptionImages', [...data.descriptionImages, ...files.filter(f => f.type.startsWith('image/'))]);
    const removeDesc = (i: number) => { const n = [...data.descriptionImages]; n.splice(i, 1); setData('descriptionImages', n); };

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const fd = new FormData();
        fd.append('title_khmer', data.title_khmer);
        fd.append('title_eng', data.title_eng);
        fd.append('content', data.description);
        fd.append('post_date', data.post_date);
        data.skills.forEach((s, i) => { if (s.trim()) fd.append(`skills[${i}]`, s.trim()); });
        data.slideImages.forEach((f, i) => fd.append(`slide_images[${i}]`, f));
        data.descriptionImages.forEach((f, i) => fd.append(`description_images[${i}]`, f));
        post('/departments', { data: fd, forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Departments', href: '/departments' }, { title: 'Create', href: '#' }]}>
            <Head title="Create Department" />
            <div className="p-4 md:p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">New Department</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Create a new academic department</p>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Left */}
                        <div className="space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                                <h2 className="text-sm font-semibold text-gray-700">Department Info</h2>
                                <div>
                                    <label className={lbl}>Title (Khmer) <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="ឈ្មោះជាភាសាខ្មែរ" value={data.title_khmer}
                                        onChange={e => setData('title_khmer', e.target.value)} className={inp} />
                                    {errors.title_khmer && <p className={err}>{errors.title_khmer}</p>}
                                </div>
                                <div>
                                    <label className={lbl}>Title (English) <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="Department name in English" value={data.title_eng}
                                        onChange={e => setData('title_eng', e.target.value)} className={inp} />
                                    {errors.title_eng && <p className={err}>{errors.title_eng}</p>}
                                </div>
                                <div>
                                    <label className={lbl}>Description</label>
                                    <textarea placeholder="Describe the department…" value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={5} className={inp + ' resize-none'} />
                                    {errors.description && <p className={err}>{errors.description}</p>}
                                </div>
                                <div>
                                    <label className={lbl}>Date</label>
                                    <input type="date" value={data.post_date}
                                        onChange={e => setData('post_date', e.target.value)} className={inp} />
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 mb-3">Skill Points</h2>
                                <div className="space-y-2">
                                    {data.skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input type="text" placeholder={`Skill #${i + 1}`} value={skill}
                                                onChange={e => handleSkill(i, e.target.value)}
                                                className={inp} />
                                            <button type="button" onClick={() => removeSkill(i)}
                                                className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addSkill}
                                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    <PlusCircle className="w-4 h-4" /> Add Skill
                                </button>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="space-y-5">
                            {/* Slide Images */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 mb-3">Slide Images</h2>
                                <div
                                    onDrop={e => { e.preventDefault(); addSlides(Array.from(e.dataTransfer.files)); }}
                                    onDragOver={e => e.preventDefault()}
                                    onClick={() => slideRef.current?.click()}
                                    className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-6 text-center"
                                >
                                    <ImagePlus className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Drag & drop or <span className="text-blue-600 font-medium">browse</span></p>
                                    <input ref={slideRef} type="file" multiple accept="image/*"
                                        onChange={e => addSlides(Array.from(e.target.files ?? []))} className="hidden" />
                                </div>
                                {data.slideImages.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {data.slideImages.map((f, i) => (
                                            <div key={i} className="relative group">
                                                <img src={URL.createObjectURL(f)} alt="" className="h-20 w-full rounded-lg border object-cover" />
                                                <button type="button" onClick={() => removeSlide(i)}
                                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description Images */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 mb-3">Description Images</h2>
                                <div
                                    onDrop={e => { e.preventDefault(); addDescs(Array.from(e.dataTransfer.files)); }}
                                    onDragOver={e => e.preventDefault()}
                                    onClick={() => descRef.current?.click()}
                                    className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-6 text-center"
                                >
                                    <ImagePlus className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Drag & drop or <span className="text-blue-600 font-medium">browse</span></p>
                                    <input ref={descRef} type="file" multiple accept="image/*"
                                        onChange={e => addDescs(Array.from(e.target.files ?? []))} className="hidden" />
                                </div>
                                {data.descriptionImages.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {data.descriptionImages.map((f, i) => (
                                            <div key={i} className="relative group">
                                                <img src={URL.createObjectURL(f)} alt="" className="h-20 w-full rounded-lg border object-cover" />
                                                <button type="button" onClick={() => removeDesc(i)}
                                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                {processing ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Department'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
