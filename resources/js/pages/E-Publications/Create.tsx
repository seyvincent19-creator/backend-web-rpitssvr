import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function Create() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const auth = (usePage().props as { auth?: { user: { id: number; name: string } } }).auth;
    if (!auth) {
        throw new Error('Auth user not found in page props.');
    }

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        author: '',
        year: new Date().getFullYear(),
        publisher: '',
        language: '',
        pages: '',
        category: '',
        url: '',
        image: null as File | null,
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('image', e.target.files?.[0] || null);
    };

    function submit(e: React.FormEvent) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('author', data.author);
        formData.append('year', data.year.toString());
        formData.append('publisher', data.publisher);
        formData.append('language', data.language);
        formData.append('pages', data.pages);
        formData.append('category', data.category);
        formData.append('url', data.url);
        if (data.image) {
            formData.append('image', data.image);
        }

        post('/ebooks', {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Ebook saved successfully!');
            },
            onError: () => {
                toast.error('Failed to save ebook.');
            },
        });
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Ebooks', href: '/ebooks' },
                { title: 'Create', href: '#' },
            ]}
        >
            <Head title="Create Ebook" />

            {/* Toast container */}
            <Toaster position="top-right" />

            <form onSubmit={submit} className="mx-auto w-full max-w-screen-xl space-y-6 p-6">
                <h1 className="text-center text-3xl font-bold">Create New Ebook</h1>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left Side: Main Ebook Fields */}
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <input
                                type="text"
                                placeholder="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded border p-3"
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>
                        {/* Author */}
                        <div>
                            <input
                                type="text"
                                placeholder="Author"
                                value={data.author}
                                onChange={(e) => setData('author', e.target.value)}
                                className="w-full rounded border p-3"
                            />
                            {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
                        </div>
                        {/* Year */}
                        <div>
                            <input
                                type="number"
                                placeholder="Year"
                                value={data.year}
                                onChange={(e) => setData('year', e.target.value)}
                                className="w-full rounded border p-3"
                                min={1900}
                                max={new Date().getFullYear()}
                            />
                            {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                        </div>
                        {/* Publisher */}
                        <div>
                            <input
                                type="text"
                                placeholder="Publisher"
                                value={data.publisher}
                                onChange={(e) => setData('publisher', e.target.value)}
                                className="w-full rounded border p-3"
                            />
                            {errors.publisher && <p className="text-sm text-red-500">{errors.publisher}</p>}
                        </div>
                        {/* Language */}
                        <div>
                            <input
                                type="text"
                                placeholder="Language"
                                value={data.language}
                                onChange={(e) => setData('language', e.target.value)}
                                className="w-full rounded border p-3"
                            />
                            {errors.language && <p className="text-sm text-red-500">{errors.language}</p>}
                        </div>
                        {/* Pages */}
                        <div>
                            <input
                                type="number"
                                placeholder="Pages"
                                value={data.pages}
                                onChange={(e) => setData('pages', e.target.value)}
                                className="w-full rounded border p-3"
                                min={1}
                            />
                            {errors.pages && <p className="text-sm text-red-500">{errors.pages}</p>}
                        </div>
                    </div>

                    {/* Right Side: Additional Fields */}
                    <div className="space-y-4">
                        {/* Category */}
                        {/* Category */}
                        <div>
                            <select value={data.category} onChange={(e) => setData('category', e.target.value)} className="w-full rounded border p-3">
                                <option value="">Select Category</option>
                                <option value="វិទ្យាសាស្រ្តកុំព្យូទ័រ">វិទ្យាសាស្រ្តកុំព្យូទ័រ</option>
                                <option value="អគ្គិសនី">អគ្គិសនី</option>
                                <option value="មេកាត្រូនិក">មេកាត្រូនិក</option>
                                <option value="មេកានិកឧស្សាហកម្ម">មេកានិកឧស្សាហកម្ម</option>
                                <option value="អេឡិចត្រូនិក">អេឡិចត្រូនិក</option>
                                <option value="មេកានិករថយន្ត">មេកានិករថយន្ត</option>
                                <option value="សំណង់ស៊ីវិល">សំណង់ស៊ីវិល</option>
                                <option value="ជំនាញបរិក្ខាត្រជាក់">ជំនាញបរិក្ខាត្រជាក់</option>
                                <option value="អក្សរសាស្រ្តអង់គ្លេស">អក្សរសាស្រ្តអង់គ្លេស</option>
                                <option value="គណនេយ្យ និងហិរញ្ញវត្ថុ">គណនេយ្យ និងហិរញ្ញវត្ថុ</option>
                            </select>
                            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                        </div>

                        {/* URL */}
                        <div>
                            <input
                                type="url"
                                placeholder="Download URL"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                className="w-full rounded border p-3"
                            />
                            {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                        </div>
                        {/* Cover Image Upload */}
                        <div>
                            <label className="mb-1 block font-semibold">Cover Image</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-gray-50 p-5 hover:bg-gray-100"
                            >
                                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" ref={fileInputRef} />
                                {data.image ? (
                                    <img
                                        src={URL.createObjectURL(data.image)}
                                        alt="Ebook Cover Preview"
                                        className="h-40 w-40 rounded-md border object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400 select-none">Click or drop cover image here</span>
                                )}
                            </div>
                            {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}
                        </div>
                        {/* Submit */}
                        <div>
                            <button type="submit" disabled={processing} className="w-full rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                                {processing ? 'Saving...' : 'Save Ebook'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
