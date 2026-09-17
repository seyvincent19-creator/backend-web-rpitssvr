import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { ChangeEvent, FormEvent, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";
const err = "mt-1.5 text-xs text-red-500";

type JournalForm = {
    title: string; abstract: string; author: string; published: string;
    language: string; pages: number | string; url: string; image: File | null;
};

export default function Create() {
    const fileRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, reset } = useForm<JournalForm>({
        title: '', abstract: '', author: '', published: '', language: '', pages: '', url: '', image: null,
    });

    const handle = (field: keyof JournalForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const v = e.target.value;
        if (field === 'pages') setData(field, v === '' ? '' : Number(v));
        else setData(field, v);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('title', data.title); fd.append('abstract', data.abstract);
        fd.append('author', data.author); fd.append('published', data.published);
        fd.append('language', data.language); fd.append('pages', String(data.pages));
        fd.append('url', data.url);
        if (data.image) fd.append('image', data.image);
        post('/journals', {
            data: fd, forceFormData: true,
            onSuccess: () => { toast.success('Journal saved!'); reset(); },
            onError: () => toast.error('Failed to save journal.'),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Journals', href: '/journals' }, { title: 'Create', href: '#' }]}>
            <Head title="Create Journal" />
            <Toaster position="top-right" />
            <div className="p-4 md:p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">New Journal</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Add a new journal to the library</p>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                                <h2 className="text-sm font-semibold text-gray-700">Journal Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className={lbl}>Title <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Journal title" value={data.title} onChange={handle('title')} className={inp} />
                                        {errors.title && <p className={err}>{errors.title}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={lbl}>Abstract <span className="text-red-500">*</span></label>
                                        <textarea placeholder="Abstract" rows={4} value={data.abstract} onChange={handle('abstract')} className={inp} />
                                        {errors.abstract && <p className={err}>{errors.abstract}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Author <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Author name" value={data.author} onChange={handle('author')} className={inp} />
                                        {errors.author && <p className={err}>{errors.author}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Published Date</label>
                                        <input type="date" value={data.published} onChange={handle('published')} className={inp} />
                                        {errors.published && <p className={err}>{errors.published}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Language</label>
                                        <input type="text" placeholder="e.g. Khmer, English" value={data.language} onChange={handle('language')} className={inp} />
                                        {errors.language && <p className={err}>{errors.language}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Pages</label>
                                        <input type="number" placeholder="Number of pages" value={data.pages} onChange={handle('pages')} min={1} className={inp} />
                                        {errors.pages && <p className={err}>{errors.pages}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={lbl}>Download URL</label>
                                        <input type="url" placeholder="https://…" value={data.url} onChange={handle('url')} className={inp} />
                                        {errors.url && <p className={err}>{errors.url}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 mb-3">Cover Image</h2>
                                <div onClick={() => fileRef.current?.click()}
                                    className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
                                    {data.image ? (
                                        <img src={URL.createObjectURL(data.image)} alt=""
                                            className="w-full aspect-[3/4] object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 aspect-[3/4]">
                                            <ImagePlus className="w-8 h-8 text-gray-300 mb-2" />
                                            <p className="text-xs text-gray-500 text-center">Click to upload cover</p>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept="image/*"
                                    onChange={e => setData('image', e.target.files?.[0] ?? null)} className="hidden" />
                                {errors.image && <p className={err}>{errors.image}</p>}
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                {processing ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Journal'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
