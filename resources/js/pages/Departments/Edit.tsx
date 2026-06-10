import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ImagePlus, LoaderCircle, PlusCircle, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";
const errCls = "mt-1.5 text-xs text-red-500";

interface DeptImage { id: number; type: string; path: string }
interface DeptSkill { id: number; skill: string }
interface Department {
    id: number; title_khmer: string; title_eng: string; description: string;
    images: DeptImage[]; skills: DeptSkill[];
}
interface Props { department: Department }

function storageUrl(p: string) {
    if (!p) return '';
    return p.startsWith('/storage') || p.startsWith('storage') ? (p.startsWith('/') ? p : `/${p}`) : `/storage/${p}`;
}

export default function Edit({ department }: Props) {
    const slideRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Text fields
    const [titleKhmer, setTitleKhmer] = useState(department.title_khmer);
    const [titleEng, setTitleEng] = useState(department.title_eng);
    const [description, setDescription] = useState(department.description ?? '');

    // Skills: existing (can remove) + new (to add)
    const [existingSkills, setExistingSkills] = useState<DeptSkill[]>(department.skills ?? []);
    const [removeSkills, setRemoveSkills] = useState<number[]>([]);
    const [newSkills, setNewSkills] = useState<string[]>(['']);

    // Images: existing (can remove) + new files
    const slides = department.images?.filter(i => i.type === 'slide') ?? [];
    const descs = department.images?.filter(i => i.type === 'description') ?? [];

    const [removeImages, setRemoveImages] = useState<number[]>([]);
    const [existingSlides, setExistingSlides] = useState<DeptImage[]>(slides);
    const [existingDescs, setExistingDescs] = useState<DeptImage[]>(descs);
    const [newSlides, setNewSlides] = useState<File[]>([]);
    const [newDescs, setNewDescs] = useState<File[]>([]);

    // Skills handlers
    const removeExistingSkill = (id: number) => {
        setExistingSkills(prev => prev.filter(s => s.id !== id));
        setRemoveSkills(prev => [...prev, id]);
    };
    const handleNewSkill = (i: number, v: string) => {
        const n = [...newSkills]; n[i] = v; setNewSkills(n);
    };
    const addNewSkill = () => setNewSkills(prev => [...prev, '']);
    const removeNewSkill = (i: number) => setNewSkills(prev => prev.filter((_, idx) => idx !== i));

    // Image handlers
    const removeExistingImage = (img: DeptImage) => {
        if (img.type === 'slide') setExistingSlides(prev => prev.filter(i => i.id !== img.id));
        else setExistingDescs(prev => prev.filter(i => i.id !== img.id));
        setRemoveImages(prev => [...prev, img.id]);
    };
    const addSlides = (files: File[]) => setNewSlides(prev => [...prev, ...files.filter(f => f.type.startsWith('image/'))]);
    const removeNewSlide = (i: number) => setNewSlides(prev => prev.filter((_, idx) => idx !== i));
    const addDescs_ = (files: File[]) => setNewDescs(prev => [...prev, ...files.filter(f => f.type.startsWith('image/'))]);
    const removeNewDesc = (i: number) => setNewDescs(prev => prev.filter((_, idx) => idx !== i));

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const fd = new FormData();
        fd.append('_method', 'PUT');
        fd.append('title_khmer', titleKhmer);
        fd.append('title_eng', titleEng);
        fd.append('description', description);
        removeSkills.forEach(id => fd.append('remove_skills[]', String(id)));
        newSkills.forEach(s => { if (s.trim()) fd.append('new_skills[]', s.trim()); });
        removeImages.forEach(id => fd.append('remove_images[]', String(id)));
        newSlides.forEach(f => fd.append('slide_images[]', f));
        newDescs.forEach(f => fd.append('description_images[]', f));

        router.post(`/departments/${department.id}`, fd, {
            forceFormData: true,
            onError: errs => { setErrors(errs); setIsSubmitting(false); },
            onFinish: () => setIsSubmitting(false),
        });
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Departments', href: '/departments' },
            { title: 'Edit', href: '#' },
        ]}>
            <Head title="Edit Department" />
            <div className="p-4 md:p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Edit Department</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{department.title_eng}</p>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Left column */}
                        <div className="space-y-5">
                            {/* Basic info */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                                <h2 className="text-sm font-semibold text-gray-700">Department Info</h2>
                                <div>
                                    <label className={lbl}>Title (Khmer) <span className="text-red-500">*</span></label>
                                    <input type="text" value={titleKhmer} onChange={e => setTitleKhmer(e.target.value)} className={inp} />
                                    {errors.title_khmer && <p className={errCls}>{errors.title_khmer}</p>}
                                </div>
                                <div>
                                    <label className={lbl}>Title (English) <span className="text-red-500">*</span></label>
                                    <input type="text" value={titleEng} onChange={e => setTitleEng(e.target.value)} className={inp} />
                                    {errors.title_eng && <p className={errCls}>{errors.title_eng}</p>}
                                </div>
                                <div>
                                    <label className={lbl}>Description</label>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                                        rows={5} className={inp + ' resize-none'} />
                                    {errors.description && <p className={errCls}>{errors.description}</p>}
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 mb-3">Skill Points</h2>

                                {/* Existing skills */}
                                {existingSkills.length > 0 && (
                                    <div className="mb-3 space-y-2">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Existing</p>
                                        {existingSkills.map(s => (
                                            <div key={s.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                <span className="flex-1 text-sm text-gray-700">{s.skill}</span>
                                                <button type="button" onClick={() => removeExistingSkill(s.id)}
                                                    className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* New skills */}
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">Add New</p>
                                <div className="space-y-2">
                                    {newSkills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input type="text" placeholder={`New skill #${i + 1}`} value={skill}
                                                onChange={e => handleNewSkill(i, e.target.value)} className={inp} />
                                            <button type="button" onClick={() => removeNewSkill(i)}
                                                className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addNewSkill}
                                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    <PlusCircle className="w-4 h-4" /> Add Skill
                                </button>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-5">
                            {/* Slide images */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 mb-3">Slide Images</h2>

                                {existingSlides.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">Existing</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {existingSlides.map(img => (
                                                <div key={img.id} className="relative group">
                                                    <img src={storageUrl(img.path)} alt=""
                                                        className="h-20 w-full rounded-xl border object-cover" />
                                                    <button type="button" onClick={() => removeExistingImage(img)}
                                                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div
                                    onDrop={e => { e.preventDefault(); addSlides(Array.from(e.dataTransfer.files)); }}
                                    onDragOver={e => e.preventDefault()}
                                    onClick={() => slideRef.current?.click()}
                                    className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-5 text-center"
                                >
                                    <ImagePlus className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                                    <p className="text-xs text-gray-500">Click to add new slides</p>
                                    <input ref={slideRef} type="file" multiple accept="image/*"
                                        onChange={e => addSlides(Array.from(e.target.files ?? []))} className="hidden" />
                                </div>
                                {newSlides.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {newSlides.map((f, i) => (
                                            <div key={i} className="relative group">
                                                <img src={URL.createObjectURL(f)} alt="" className="h-20 w-full rounded-xl border object-cover" />
                                                <button type="button" onClick={() => removeNewSlide(i)}
                                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.slide_images && <p className={errCls}>{errors.slide_images}</p>}
                            </div>

                            {/* Description images */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 mb-3">Description Images</h2>

                                {existingDescs.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">Existing</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {existingDescs.map(img => (
                                                <div key={img.id} className="relative group">
                                                    <img src={storageUrl(img.path)} alt=""
                                                        className="h-20 w-full rounded-xl border object-cover" />
                                                    <button type="button" onClick={() => removeExistingImage(img)}
                                                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div
                                    onDrop={e => { e.preventDefault(); addDescs_(Array.from(e.dataTransfer.files)); }}
                                    onDragOver={e => e.preventDefault()}
                                    onClick={() => descRef.current?.click()}
                                    className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-5 text-center"
                                >
                                    <ImagePlus className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                                    <p className="text-xs text-gray-500">Click to add new description images</p>
                                    <input ref={descRef} type="file" multiple accept="image/*"
                                        onChange={e => addDescs_(Array.from(e.target.files ?? []))} className="hidden" />
                                </div>
                                {newDescs.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {newDescs.map((f, i) => (
                                            <div key={i} className="relative group">
                                                <img src={URL.createObjectURL(f)} alt="" className="h-20 w-full rounded-xl border object-cover" />
                                                <button type="button" onClick={() => removeNewDesc(i)}
                                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.description_images && <p className={errCls}>{errors.description_images}</p>}
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3">
                                <a href="/departments"
                                    className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
                                    Cancel
                                </a>
                                <button type="submit" disabled={isSubmitting}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                    {isSubmitting ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
