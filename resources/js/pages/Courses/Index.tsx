import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Layers, PlusCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type Department = { id: number; title_khmer: string };
type Subject = { id: number; name: string };
type Semester = { id: number; name: string; subjects?: Subject[] | null };
type Course = {
    id: number; department_id: number; year: string | number;
    department?: Department | null; created_at: string;
    semesters?: Semester[] | null;
};
type LinkItem = { url: string | null; label: string; active: boolean };
type CoursesProp = { data: Course[]; meta?: any; links?: LinkItem[] } | Course[];

export default function Index() {
    const { props } = usePage();
    const rawCourses = (props as any)?.courses as CoursesProp;

    const normalized = useMemo(() => {
        if (Array.isArray(rawCourses)) {
            const data = rawCourses;
            return { data, links: [] as LinkItem[] };
        }
        const { data, links } = rawCourses as { data?: Course[]; links?: LinkItem[] };
        return { data: data ?? [], links: links ?? [] };
    }, [rawCourses]);

    const courseList = normalized.data;
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const filtered = courseList.filter(c =>
        (c.department?.title_khmer ?? '').toLowerCase().includes(search.toLowerCase()) ||
        String(c.year).includes(search)
    );

    const toggle = (id: number) => setExpanded(s => ({ ...s, [id]: !s[id] }));

    return (
        <AppLayout breadcrumbs={[{ title: 'Courses', href: '/courses' }]}>
            <Head title="Courses" />
            <div className="p-4 md:p-6 space-y-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Courses</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{courseList.length} total courses</p>
                    </div>
                    <Link
                        href="/courses/create"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" /> New Course
                    </Link>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by department or year…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-4 py-3 w-8" />
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Department</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Year</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Semesters</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Created</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-gray-400">
                                        <Layers className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        <p>No courses found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((course) => {
                                const semCount = course.semesters?.length ?? 0;
                                const isOpen = !!expanded[course.id];

                                return (
                                    <>
                                        <tr key={course.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 w-8">
                                                <button
                                                    type="button"
                                                    onClick={() => toggle(course.id)}
                                                    className="p-1 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    aria-expanded={isOpen}
                                                >
                                                    {isOpen
                                                        ? <ChevronDown className="w-4 h-4" />
                                                        : <ChevronRight className="w-4 h-4" />}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                                                        <Layers className="w-4 h-4 text-rose-500" />
                                                    </div>
                                                    <p className="font-medium text-gray-900">{course.department?.title_khmer ?? '—'}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                                    Year {course.year}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                                                {semCount} semester{semCount !== 1 ? 's' : ''}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell whitespace-nowrap">
                                                {course.created_at ? new Date(course.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/courses/${course.id}/edit`}
                                                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={`/courses/${course.id}`}
                                                        className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                                    >
                                                        Manage
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>

                                        {isOpen && (
                                            <tr key={`${course.id}-detail`} className="bg-gray-50/60">
                                                <td colSpan={6} className="px-6 py-4">
                                                    {semCount === 0 ? (
                                                        <p className="text-sm text-gray-500 italic">No semesters added yet.</p>
                                                    ) : (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {course.semesters!.map(sem => (
                                                                <div key={sem.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <p className="text-sm font-semibold text-gray-800">{sem.name}</p>
                                                                        <span className="text-xs text-gray-400">{sem.subjects?.length ?? 0} subjects</span>
                                                                    </div>
                                                                    {sem.subjects && sem.subjects.length > 0 && (
                                                                        <ul className="space-y-1">
                                                                            {sem.subjects.map(s => (
                                                                                <li key={s.id} className="text-xs text-gray-600 flex items-center gap-1.5">
                                                                                    <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                    {s.name}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {normalized.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {normalized.links.map((link, idx) =>
                            link.url ? (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                        link.active ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span key={idx} className="px-3 py-1.5 text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                            )
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
