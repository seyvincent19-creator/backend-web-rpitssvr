import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { ChangeEvent, FormEvent, useMemo, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";
const err = "mt-1.5 text-xs text-red-500";

const CATEGORIES = [
    'វិទ្យាសាស្រ្តកុំព្យូទ័រ','អគ្គិសនី','មេកាត្រូនិក','មេកានិកឧស្សាហកម្ម',
    'អេឡិចត្រូនិក','មេកានិករថយន្ត','សំណង់ស៊ីវិល','ជំនាញបរិក្ខាត្រជាក់',
    'អក្សរសាស្រ្តអង់គ្លេស','គណនេយ្យ និងហិរញ្ញវត្ថុ',
];

type AudioForm = {
    title: string; author: string; year: number | string; publisher: string;
    type: string; category: string; language: string; location: string;
    duration: string; url: string; image: File | null;
};

export default function Create() {
    const fileRef = useRef<HTMLInputElement>(null);
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const { data, setData, post, processing, errors, reset } = useForm<AudioForm>({
        title: '', author: '', year: currentYear, publisher: '',
        type: '', category: '', language: '', location: '', duration: '', url: '', image: null,
    });

    const handle = (field: keyof AudioForm) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const v = e.target.value;
        if (field === 'year') setData(field, v === '' ? '' : Number(v));
        else setData(field, v);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('title', data.title); fd.append('author', data.author);
        fd.append('year', String(data.year)); fd.append('publisher', data.publisher);
        fd.append('type', data.type); fd.append('category', data.category);
        fd.append('language', data.language); fd.append('location', data.location);
        fd.append('duration', data.duration); fd.append('url', data.url);
        if (data.image) fd.append('image', data.image);
        post('/audios', {
            data: fd, forceFormData: true,
            onSuccess: () => { toast.success('Audio saved!'); reset(); },
            onError: () => toast.error('Failed to save audio.'),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Audios', href: '/audios' }, { title: 'Create', href: '#' }]}>
            <Head title="Create Audio" />
            <Toaster position="top-right" />
            <div className="p-4 md:p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">New Audio</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Add a new audio recording to the library</p>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-5">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                                <h2 className="text-sm font-semibold text-gray-700">Audio Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={lbl}>Title <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Audio title" value={data.title} onChange={handle('title')} className={inp} />
                                        {errors.title && <p className={err}>{errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Author <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Author / speaker name" value={data.author} onChange={handle('author')} className={inp} />
                                        {errors.author && <p className={err}>{errors.author}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Publisher</label>
                                        <input type="text" placeholder="Publisher" value={data.publisher} onChange={handle('publisher')} className={inp} />
                                        {errors.publisher && <p className={err}>{errors.publisher}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Year</label>
                                        <input type="number" value={data.year} onChange={handle('year')} min={1900} max={currentYear} className={inp} />
                                        {errors.year && <p className={err}>{errors.year}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Type</label>
                                        <input type="text" placeholder="e.g. Lecture, Podcast" value={data.type} onChange={handle('type')} className={inp} />
                                        {errors.type && <p className={err}>{errors.type}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Category</label>
                                        <select value={data.category} onChange={handle('category')} className={inp}>
                                            <option value="">Select category…</option>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        {errors.category && <p className={err}>{errors.category}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Language</label>
                                        <input type="text" placeholder="e.g. Khmer, English" value={data.language} onChange={handle('language')} className={inp} />
                                        {errors.language && <p className={err}>{errors.language}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Location</label>
                                        <input type="text" placeholder="Recording location" value={data.location} onChange={handle('location')} className={inp} />
                                        {errors.location && <p className={err}>{errors.location}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Duration</label>
                                        <input type="text" placeholder="e.g. 45:30" value={data.duration} onChange={handle('duration')} className={inp} />
                                        {errors.duration && <p className={err}>{errors.duration}</p>}
                                    </div>
                                    <div>
                                        <label className={lbl}>Audio URL</label>
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
                                {processing ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Audio'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
