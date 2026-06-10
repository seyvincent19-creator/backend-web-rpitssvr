import { router, useForm } from '@inertiajs/react';
import { ImagePlus, LoaderCircle, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";
const errCls = "mt-1.5 text-xs text-red-500";

const MAJORS = [
    'វិទ្យាសាស្រ្តកុំព្យូទ័រ','អគ្គិសនី','មេកាត្រូនិក','មេកានិកឧស្សាហកម្ម',
    'អេឡិចត្រូនិក','មេកានិករថយន្ត','សំណង់ស៊ីវិល','ជំនាញបរិក្ខាត្រជាក់',
    'អក្សរសាស្រ្តអង់គ្លេស','គណនេយ្យ និងហិរញ្ញវត្ថុ',
];

interface Thesis {
    id: number; title: string; student: string; supervisor: string; major: string;
    year: number; type: string; category: string; language: string; pages: number;
    url: string; image: string;
}
interface Props { show: boolean; thesis: Thesis; onClose: () => void }

function storageUrl(p: string) {
    if (!p) return '';
    return p.startsWith('/storage') || p.startsWith('storage') ? (p.startsWith('/') ? p : `/${p}`) : `/storage/${p}`;
}

export default function EditThesisModal({ show, thesis, onClose }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [coverBroken, setCoverBroken] = useState(false);
    const { data, setData, setError, clearErrors, processing, errors } = useForm({
        title: thesis.title, student: thesis.student, supervisor: thesis.supervisor,
        major: thesis.major, year: thesis.year, type: thesis.type,
        category: thesis.category, language: thesis.language, pages: thesis.pages,
        url: thesis.url, image: null as File | null,
    });

    // Reset form and broken-cover flag whenever a different thesis is opened
    useEffect(() => {
        setData({
            title: thesis.title, student: thesis.student, supervisor: thesis.supervisor,
            major: thesis.major, year: thesis.year, type: thesis.type,
            category: thesis.category, language: thesis.language, pages: thesis.pages,
            url: thesis.url, image: null,
        });
        setCoverBroken(false);
        clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thesis.id]);

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
        fd.append('title', data.title); fd.append('student', data.student);
        fd.append('supervisor', data.supervisor); fd.append('major', data.major);
        fd.append('year', String(data.year)); fd.append('type', data.type);
        fd.append('category', data.category); fd.append('language', data.language);
        fd.append('pages', String(data.pages)); fd.append('url', data.url);
        if (data.image) fd.append('image', data.image);
        router.post(`/thesis/${thesis.id}`, fd, {
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
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Edit Thesis</h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-5">
                    <div>
                        <label className={lbl}>Title</label>
                        <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className={inp} />
                        {errors.title && <p className={errCls}>{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={lbl}>Student</label>
                            <input type="text" value={data.student} onChange={e => setData('student', e.target.value)} className={inp} />
                            {errors.student && <p className={errCls}>{errors.student}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Supervisor</label>
                            <input type="text" value={data.supervisor} onChange={e => setData('supervisor', e.target.value)} className={inp} />
                            {errors.supervisor && <p className={errCls}>{errors.supervisor}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Major</label>
                            <select value={data.major} onChange={e => setData('major', e.target.value)} className={inp}>
                                <option value="">Select…</option>
                                {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            {errors.major && <p className={errCls}>{errors.major}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Year</label>
                            <input type="number" value={data.year} onChange={e => setData('year', Number(e.target.value))} min={1900} max={new Date().getFullYear()} className={inp} />
                            {errors.year && <p className={errCls}>{errors.year}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Type</label>
                            <select value={data.type} onChange={e => setData('type', e.target.value)} className={inp}>
                                <option value="">Select…</option>
                                <option value="PDF">PDF</option>
                                <option value="MS Word">MS Word</option>
                            </select>
                            {errors.type && <p className={errCls}>{errors.type}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Category</label>
                            <select value={data.category} onChange={e => setData('category', e.target.value)} className={inp}>
                                <option value="">Select…</option>
                                <option value="សារណា">សារណា</option>
                                <option value="របាយការណ៍កម្មសិក្សា">របាយការណ៍កម្មសិក្សា</option>
                            </select>
                            {errors.category && <p className={errCls}>{errors.category}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Language</label>
                            <select value={data.language} onChange={e => setData('language', e.target.value)} className={inp}>
                                <option value="">Select…</option>
                                <option value="ភាសាខ្មែរ">ភាសាខ្មែរ</option>
                                <option value="អង់គ្លេស">អង់គ្លេស</option>
                            </select>
                            {errors.language && <p className={errCls}>{errors.language}</p>}
                        </div>
                        <div>
                            <label className={lbl}>Pages</label>
                            <input type="number" value={data.pages} onChange={e => setData('pages', Number(e.target.value))} min={1} className={inp} />
                            {errors.pages && <p className={errCls}>{errors.pages}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className={lbl}>Download URL</label>
                            <input type="url" value={data.url} onChange={e => setData('url', e.target.value)} className={inp} />
                            {errors.url && <p className={errCls}>{errors.url}</p>}
                        </div>
                    </div>

                    {/* Cover image */}
                    <div>
                        <label className={lbl}>Cover Image</label>
                        <div className="flex items-start gap-4">
                            {data.image ? (
                                <img
                                    src={URL.createObjectURL(data.image)}
                                    alt="New cover"
                                    className="w-16 h-20 rounded-lg border object-cover flex-shrink-0"
                                />
                            ) : thesis.image && !coverBroken ? (
                                <img
                                    src={storageUrl(thesis.image)}
                                    alt="Current cover"
                                    className="w-16 h-20 rounded-lg border object-cover flex-shrink-0"
                                    onError={() => setCoverBroken(true)}
                                />
                            ) : (
                                <div className="w-16 h-20 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center flex-shrink-0 gap-1">
                                    <ImagePlus className="w-5 h-5 text-gray-300" />
                                    <span className="text-[9px] text-gray-400 text-center leading-tight">No<br/>cover</span>
                                </div>
                            )}
                            <div onClick={() => fileRef.current?.click()}
                                className="flex-1 cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-4 text-center">
                                <ImagePlus className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-500">
                                    {thesis.image && !coverBroken ? 'Click to change cover' : 'Click to upload cover'}
                                </p>
                                <input ref={fileRef} type="file" accept="image/*"
                                    onChange={e => setData('image', e.target.files?.[0] ?? null)} className="hidden" />
                            </div>
                        </div>
                        {coverBroken && !data.image && (
                            <p className="mt-1.5 text-xs text-amber-600">
                                ⚠ Previous cover image file is missing — please upload a new one.
                            </p>
                        )}
                        {errors.image && <p className={errCls}>{errors.image}</p>}
                    </div>

                    {/* Footer */}
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
