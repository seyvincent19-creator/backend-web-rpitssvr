import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    last_name_kh: string;
    first_name_kh: string;
    last_name_en: string;
    first_name_en: string;
    gender: string | null;
    dob: string | null;
    phone: string;
    email: string | null;
    province: string | null;
    major: string;
    year: string;
    photo_path: string | null;
    created_at: string;
}

interface LinkItem { url: string | null; label: string; active: boolean }

interface Props {
    students: { data: Student[]; links: LinkItem[] };
}

const MAJOR_LABELS: Record<string, string> = {
    computer_science: 'Computer Science',
    electrical: 'Electrical',
    mechatronics: 'Mechatronics',
    industrial_mechanics: 'Industrial Mechanics',
    electronics: 'Electronics',
    automotive: 'Automotive',
    civil: 'Civil Engineering',
    refrigeration: 'Refrigeration',
    english: 'English',
    accounting: 'Accounting',
};

function storageUrl(path: string) {
    if (!path) return '';
    return path.startsWith('/storage') || path.startsWith('storage')
        ? path.startsWith('/') ? path : `/${path}`
        : `/storage/${path}`;
}

export default function Index() {
    const { students } = usePage<Props>().props;
    const list = students?.data ?? [];

    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const filtered = list.filter(s =>
        `${s.last_name_kh} ${s.first_name_kh} ${s.last_name_en} ${s.first_name_en} ${s.phone}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    function confirmDelete(student: Student) {
        if (confirm(`Delete ${student.first_name_en} ${student.last_name_en}? This cannot be undone.`)) {
            setDeletingId(student.id);
            router.delete(`/students/${student.id}`, {
                onFinish: () => setDeletingId(null),
            });
        }
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Students', href: '/students' }]}>
            <Head title="Students" />
            <div className="p-4 md:p-6 space-y-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Students</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{list.length} enrolled students</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or phone…"
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
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 w-10">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Student</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Major</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Year</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Province</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-gray-400">
                                        <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        <p>No students found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((student, idx) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                                {student.photo_path ? (
                                                    <img src={storageUrl(student.photo_path)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase">
                                                        {student.first_name_en?.[0] ?? '?'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {student.first_name_en} {student.last_name_en}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate" style={{ fontFamily: 'Siemreap, sans-serif' }}>
                                                    {student.first_name_kh} {student.last_name_kh}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell text-xs">
                                        {MAJOR_LABELS[student.major] ?? student.major}
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                            Year {student.year}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{student.phone}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{student.province ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/students/${student.id}`}
                                                className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/students/${student.id}/edit`}
                                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(student)}
                                                disabled={deletingId === student.id}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {students.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {students.links.map((link, idx) =>
                            link.url ? (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                        link.active
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
