import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, Eye, Pencil, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';

interface Department {
    id: number; title_khmer: string; title_eng: string;
    description: string; created_at: string;
}
interface LinkItem { url: string | null; label: string; active: boolean }
interface Props {
    departments: { data: Department[]; links: LinkItem[] };
    [key: string]: unknown;
}

export default function Index() {
    const { departments } = usePage<Props>().props;
    const list = departments?.data ?? [];
    const [search, setSearch] = useState('');

    const filtered = list.filter(d =>
        d.title_khmer.toLowerCase().includes(search.toLowerCase()) ||
        d.title_eng.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Departments', href: '/departments' }]}>
            <Head title="Departments" />
            <div className="p-4 md:p-6 space-y-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Departments</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{list.length} total departments</p>
                    </div>
                    <Link
                        href="/departments/create"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" /> New Department
                    </Link>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search departments…"
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
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name (Khmer)</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Name (English)</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Description</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Created</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-gray-400">
                                        <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        <p>No departments found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((dept, idx) => (
                                <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-4 h-4 text-violet-600" />
                                            </div>
                                            <p className="font-medium text-gray-900">{dept.title_khmer}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{dept.title_eng}</td>
                                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell max-w-xs">
                                        <p className="truncate">
                                            {dept.description
                                                ? dept.description.length > 80 ? dept.description.slice(0, 80) + '…' : dept.description
                                                : '—'}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell whitespace-nowrap">
                                        {new Date(dept.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/departments/${dept.id}/edit`}
                                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/departments/${dept.id}`}
                                                className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {departments.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {departments.links.map((link, idx) =>
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
