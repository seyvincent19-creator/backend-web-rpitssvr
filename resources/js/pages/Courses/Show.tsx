import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    ChevronDown,
    ChevronRight,
    GraduationCap,
    Layers,
    Pencil,
    PlusCircle,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface Subject  { id: number; name: string }
interface Semester { id: number; name: string; subjects: Subject[] }
interface Course   {
    id: number;
    year: string | number;
    department?: { id: number; title_khmer: string };
    semesters: Semester[];
}
interface Props { course: Course }

const inp = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";

export default function Show({ course }: Props) {
    const [openSems, setOpenSems] = useState<Record<number, boolean>>(
        Object.fromEntries((course.semesters ?? []).map(s => [s.id, true]))
    );

    // ── add subject inline ────────────────────────────────────
    const [addingTo, setAddingTo]   = useState<number | null>(null);
    const [newSubject, setNewSubject] = useState('');

    const toggleSem = (id: number) => setOpenSems(p => ({ ...p, [id]: !p[id] }));

    function handleAddSubject(semId: number) {
        const name = newSubject.trim();
        if (!name) return;
        router.post(`/courses/${course.id}`, {
            _method:          'PUT',
            department_id:    course.department?.id,
            year:             course.year,
            add_subjects:     { [semId]: name },
        }, {
            preserveScroll: true,
            onSuccess: () => { setNewSubject(''); setAddingTo(null); },
        });
    }

    function handleDeleteSubject(subId: number) {
        if (!confirm('Remove this subject?')) return;
        router.post(`/courses/${course.id}`, {
            _method:          'PUT',
            department_id:    course.department?.id,
            year:             course.year,
            remove_subjects:  [subId],
        }, { preserveScroll: true });
    }

    function handleDeleteSemester(semId: number) {
        if (!confirm('Delete this entire semester and all its subjects?')) return;
        router.post(`/courses/${course.id}`, {
            _method:          'PUT',
            department_id:    course.department?.id,
            year:             course.year,
            remove_semesters: [semId],
        }, { preserveScroll: true });
    }

    const totalSubjects = (course.semesters ?? []).reduce((n, s) => n + (s.subjects?.length ?? 0), 0);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Courses', href: '/courses' },
            { title: `${course.department?.title_khmer ?? 'Course'} — Year ${course.year}`, href: '#' },
        ]}>
            <Head title={`Manage Course — Year ${course.year}`} />
            <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">

                {/* ── Header ──────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                                <Layers className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {course.department?.title_khmer ?? '—'}
                                </h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                        Year {course.year}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {course.semesters?.length ?? 0} semesters · {totalSubjects} subjects
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link
                            href={`/courses/${course.id}/edit`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                        >
                            <Pencil className="w-4 h-4" /> Edit Course
                        </Link>
                    </div>
                </div>

                {/* ── Semesters ────────────────────────────── */}
                {(course.semesters ?? []).length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
                        <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No semesters yet</p>
                        <p className="text-sm mt-1">Use "Edit Course" to add semesters and subjects.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {course.semesters.map(sem => (
                            <div key={sem.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* Semester header */}
                                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => toggleSem(sem.id)}
                                        className="flex items-center gap-3 flex-1 text-left"
                                    >
                                        <span className="p-1 rounded-lg text-gray-400 hover:text-blue-500">
                                            {openSems[sem.id]
                                                ? <ChevronDown className="w-4 h-4" />
                                                : <ChevronRight className="w-4 h-4" />}
                                        </span>
                                        <span className="font-semibold text-gray-800">{sem.name}</span>
                                        <span className="text-xs text-gray-400">
                                            {sem.subjects?.length ?? 0} subject{sem.subjects?.length !== 1 ? 's' : ''}
                                        </span>
                                    </button>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => { setAddingTo(addingTo === sem.id ? null : sem.id); setNewSubject(''); }}
                                            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                            title="Add subject"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSemester(sem.id)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Delete semester"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Subjects list */}
                                {openSems[sem.id] && (
                                    <div className="px-5 py-3">
                                        {(sem.subjects ?? []).length === 0 && addingTo !== sem.id ? (
                                            <p className="text-sm text-gray-400 italic py-2">
                                                No subjects yet — click <PlusCircle className="inline w-3.5 h-3.5" /> to add one.
                                            </p>
                                        ) : (
                                            <ul className="space-y-1 mb-3">
                                                {sem.subjects.map((sub, idx) => (
                                                    <li key={sub.id} className="flex items-center gap-3 group px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                                        <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium flex-shrink-0">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="flex items-center gap-2 flex-1 text-sm text-gray-700">
                                                            <BookOpen className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                                                            {sub.name}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteSubject(sub.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-300 hover:text-red-500 transition-all"
                                                            title="Remove subject"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* Inline add subject */}
                                        {addingTo === sem.id && (
                                            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Subject name…"
                                                    value={newSubject}
                                                    onChange={e => setNewSubject(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') { e.preventDefault(); handleAddSubject(sem.id); }
                                                        if (e.key === 'Escape') { setAddingTo(null); setNewSubject(''); }
                                                    }}
                                                    className={inp}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddSubject(sem.id)}
                                                    className="flex-shrink-0 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setAddingTo(null); setNewSubject(''); }}
                                                    className="flex-shrink-0 p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Back link ───────────────────────────── */}
                <div>
                    <Link href="/courses" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        ← Back to Courses
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
