import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import React from 'react';

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";
const err = "mt-1.5 text-xs text-red-500";

type PageProps = {
    auth?: { user: { id: number; name: string } };
    departments?: { id: number; title_khmer: string }[];
};

export default function Create() {
    const { props } = usePage();
    const { auth, departments } = props as PageProps;
    if (!auth) throw new Error('Auth user not found.');

    const { data, setData, post, processing, errors } = useForm({
        department_id: departments?.[0] ? String(departments[0].id) : '',
        year: '1',
        semester: '1',
        subjects_text: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const fd = new FormData();
        fd.append('department_id', data.department_id);
        fd.append('year', data.year);
        fd.append('semester', data.semester);
        if (data.subjects_text) fd.append('subjects_text', data.subjects_text);
        post('/courses', { data: fd, forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Courses', href: '/courses' }, { title: 'Create', href: '#' }]}>
            <Head title="Create Course" />
            <div className="p-4 md:p-6 max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">New Course</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Set up a new course with its semesters and subjects</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                        <h2 className="text-sm font-semibold text-gray-700">Course Details</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-3">
                                <label className={lbl}>Department <span className="text-red-500">*</span></label>
                                <select value={data.department_id}
                                    onChange={e => setData('department_id', e.target.value)} className={inp}>
                                    <option value="">— Select Department —</option>
                                    {departments?.map(d => (
                                        <option key={d.id} value={d.id}>{d.title_khmer}</option>
                                    ))}
                                </select>
                                {errors.department_id && <p className={err}>{errors.department_id}</p>}
                            </div>
                            <div>
                                <label className={lbl}>Year</label>
                                <select value={data.year} onChange={e => setData('year', e.target.value)} className={inp}>
                                    {['1','2','3','4','5'].map(y => <option key={y} value={y}>Year {y}</option>)}
                                </select>
                                {errors.year && <p className={err}>{errors.year}</p>}
                            </div>
                            <div>
                                <label className={lbl}>Semester</label>
                                <select value={data.semester} onChange={e => setData('semester', e.target.value)} className={inp}>
                                    <option value="1">Semester 1</option>
                                    <option value="2">Semester 2</option>
                                </select>
                                {errors.semester && <p className={err}>{errors.semester}</p>}
                            </div>
                            <div>
                                <label className={lbl}>Created By</label>
                                <input type="text" value={auth.user.name} disabled
                                    className={inp + ' bg-gray-50 cursor-not-allowed text-gray-500'} />
                            </div>
                        </div>
                    </div>

                    {/* Subjects */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-1">Subjects</h2>
                        <p className="text-xs text-gray-400 mb-3">Enter one subject per line. Leave blank to add subjects later.</p>
                        <textarea
                            value={data.subjects_text}
                            onChange={e => setData('subjects_text', e.target.value)}
                            rows={8}
                            placeholder={"Mathematics I\nPhysics I\nIntroduction to Programming\nEnglish Communication"}
                            className={inp + ' resize-none font-mono text-xs'}
                        />
                        {errors.subjects_text && <p className={err}>{errors.subjects_text}</p>}
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                            {processing ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Course'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
