import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Layers, LoaderCircle, PlusCircle, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";
const lbl = "block text-sm font-medium text-gray-700 mb-1.5";
const errCls = "mt-1.5 text-xs text-red-500";

interface Subject  { id: number; name: string }
interface Semester { id: number; name: string; subjects: Subject[] }
interface Course   { id: number; department_id: number; year: string | number; department?: { id: number; title_khmer: string }; semesters: Semester[] }
interface Dept     { id: number; title_khmer: string }
interface Props    { course: Course; departments: Dept[] }

// State shape for an existing semester being edited
interface SemState {
    id: number;
    name: string;
    subjects: Subject[];
    removeSubjectIds: number[];
    addSubjectsText: string;
    markedForRemoval: boolean;
}

// State shape for a brand-new semester
interface NewSem { name: string; subjectsText: string }

export default function Edit({ course, departments }: Props) {
    const [deptId,   setDeptId]   = useState(String(course.department_id));
    const [year,     setYear]     = useState(String(course.year));
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [semesters, setSemesters] = useState<SemState[]>(
        (course.semesters ?? []).map(s => ({
            id: s.id,
            name: s.name,
            subjects: s.subjects ?? [],
            removeSubjectIds: [],
            addSubjectsText: '',
            markedForRemoval: false,
        }))
    );
    const [newSems, setNewSems] = useState<NewSem[]>([]);

    // ── semester helpers ──────────────────────────────────────
    const updateSem = (id: number, patch: Partial<SemState>) =>
        setSemesters(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));

    const toggleRemoveSem = (id: number) =>
        updateSem(id, { markedForRemoval: !semesters.find(s => s.id === id)?.markedForRemoval });

    const removeSubject = (semId: number, subId: number) =>
        updateSem(semId, {
            subjects: semesters.find(s => s.id === semId)!.subjects.filter(sub => sub.id !== subId),
            removeSubjectIds: [...semesters.find(s => s.id === semId)!.removeSubjectIds, subId],
        });

    // ── new semester helpers ──────────────────────────────────
    const addNewSem = () => setNewSems(prev => [...prev, { name: '', subjectsText: '' }]);
    const updateNewSem = (i: number, patch: Partial<NewSem>) =>
        setNewSems(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));
    const removeNewSem = (i: number) => setNewSems(prev => prev.filter((_, idx) => idx !== i));

    // ── submit ────────────────────────────────────────────────
    function submit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const payload: Record<string, unknown> = {
            _method:          'PUT',
            department_id:    deptId,
            year,
            remove_semesters: semesters.filter(s => s.markedForRemoval).map(s => s.id),
            remove_subjects:  semesters.flatMap(s => s.removeSubjectIds),
            update_semesters: semesters
                .filter(s => !s.markedForRemoval)
                .map(s => ({ id: s.id, name: s.name })),
            add_subjects: Object.fromEntries(
                semesters
                    .filter(s => !s.markedForRemoval && s.addSubjectsText.trim())
                    .map(s => [s.id, s.addSubjectsText])
            ),
            new_semesters: newSems
                .filter(s => s.name.trim())
                .map(s => ({ name: s.name, subjects_text: s.subjectsText })),
        };

        router.post(`/courses/${course.id}`, payload, {
            forceFormData: false,
            onError: errs  => { setErrors(errs); setSubmitting(false); },
            onFinish: ()   => setSubmitting(false),
        });
    }

    const activeSemesters  = semesters.filter(s => !s.markedForRemoval);
    const removedSemesters = semesters.filter(s => s.markedForRemoval);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Courses', href: '/courses' },
            { title: 'Edit', href: '#' },
        ]}>
            <Head title="Edit Course" />
            <div className="p-4 md:p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Edit Course</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {course.department?.title_khmer} · Year {course.year}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* ── Basic info ─────────────────────────── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Course Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={lbl}>Department <span className="text-red-500">*</span></label>
                                <select value={deptId} onChange={e => setDeptId(e.target.value)} className={inp}>
                                    <option value="">— Select Department —</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.title_khmer}</option>
                                    ))}
                                </select>
                                {errors.department_id && <p className={errCls}>{errors.department_id}</p>}
                            </div>
                            <div>
                                <label className={lbl}>Year <span className="text-red-500">*</span></label>
                                <select value={year} onChange={e => setYear(e.target.value)} className={inp}>
                                    {['1','2','3','4','5'].map(y => (
                                        <option key={y} value={y}>Year {y}</option>
                                    ))}
                                </select>
                                {errors.year && <p className={errCls}>{errors.year}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ── Existing semesters ─────────────────── */}
                    {activeSemesters.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-500" /> Semesters
                            </h2>

                            {activeSemesters.map(sem => (
                                <div key={sem.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                    {/* Semester header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <input
                                            type="text"
                                            value={sem.name}
                                            onChange={e => updateSem(sem.id, { name: e.target.value })}
                                            className={inp + ' font-medium'}
                                            placeholder="Semester name"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleRemoveSem(sem.id)}
                                            title="Remove semester"
                                            className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Existing subjects */}
                                    {sem.subjects.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                                Subjects ({sem.subjects.length})
                                            </p>
                                            <div className="space-y-1">
                                                {sem.subjects.map(sub => (
                                                    <div key={sub.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg group">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                        <span className="flex-1 text-sm text-gray-700">{sub.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSubject(sem.id, sub.id)}
                                                            className="p-1 rounded text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add subjects textarea */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                                            Add Subjects (one per line)
                                        </label>
                                        <textarea
                                            value={sem.addSubjectsText}
                                            onChange={e => updateSem(sem.id, { addSubjectsText: e.target.value })}
                                            rows={3}
                                            placeholder={"Mathematics II\nPhysics II"}
                                            className={inp + ' resize-none font-mono text-xs'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Removed semesters preview ──────────── */}
                    {removedSemesters.length > 0 && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                            <p className="text-sm font-medium text-red-600 mb-2">
                                Will be deleted ({removedSemesters.length}):
                            </p>
                            <div className="space-y-1">
                                {removedSemesters.map(s => (
                                    <div key={s.id} className="flex items-center justify-between text-sm text-red-500">
                                        <span className="line-through">{s.name}</span>
                                        <button type="button" onClick={() => toggleRemoveSem(s.id)}
                                            className="text-xs text-red-400 hover:text-red-600 underline">
                                            Undo
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── New semesters ──────────────────────── */}
                    {newSems.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold text-gray-700">New Semesters</h2>
                            {newSems.map((sem, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <input
                                            type="text"
                                            value={sem.name}
                                            onChange={e => updateNewSem(i, { name: e.target.value })}
                                            placeholder="Semester name (e.g. Semester 3)"
                                            className={inp + ' font-medium'}
                                        />
                                        <button type="button" onClick={() => removeNewSem(i)}
                                            className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                                            Subjects (one per line)
                                        </label>
                                        <textarea
                                            value={sem.subjectsText}
                                            onChange={e => updateNewSem(i, { subjectsText: e.target.value })}
                                            rows={4}
                                            placeholder={"Subject A\nSubject B\nSubject C"}
                                            className={inp + ' resize-none font-mono text-xs'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Add semester button ────────────────── */}
                    <button type="button" onClick={addNewSem}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium">
                        <PlusCircle className="w-4 h-4" /> Add New Semester
                    </button>

                    {/* ── Form footer ────────────────────────── */}
                    <div className="flex gap-3 pt-2">
                        <a href="/courses"
                            className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
                            Cancel
                        </a>
                        <button type="submit" disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                            {submitting
                                ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Saving…</>
                                : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
