import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Newspaper, Eye, Pencil, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EditJournalModal from './EditJournalModal';

interface Journal {
    id: number; title: string; abstract: string; author: string; published: string;
    language: string; pages: number; url: string; image: string; created_at: string;
}
interface LinkItem { url: string | null; label: string; active: boolean }
interface Props { journals: { data: Journal[]; links: LinkItem[] } }

function storageUrl(path: string) {
    if (!path) return '';
    return path.startsWith('/storage') || path.startsWith('storage')
        ? (path.startsWith('/') ? path : `/${path}`)
        : `/storage/${path}`;
}

export default function Index() {
    const { journals } = usePage<Props>().props;
    const journalList = journals?.data ?? [];

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);

    const filtered = journalList.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.author.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (journal: Journal) => {
        if (confirm(`Delete "${journal.title}"? This cannot be undone.`)) {
            router.delete(`/journals/${journal.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Journals', href: '/journals' }]}>
            <Head title="Journals" />
            <div className="p-4 md:p-6 space-y-5">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Journals</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{journalList.length} total journals</p>
                    </div>
                    <Link
                        href="/journals/create"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" /> New Journal
                    </Link>
                </div>

                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, author…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 w-10">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Journal</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Author</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Published</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden xl:table-cell">Pages</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-gray-400">
                                        <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        <p>No journals found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((journal, idx) => (
                                <tr key={journal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                {journal.image ? (
                                                    <img src={storageUrl(journal.image)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Newspaper className="w-4 h-4 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate max-w-[220px]">{journal.title}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{journal.language}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{journal.author}</td>
                                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{journal.published}</td>
                                    <td className="px-4 py-3 text-gray-600 hidden xl:table-cell">{journal.pages} pp.</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => { setSelectedJournal(journal); setIsModalOpen(true); }}
                                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            {journal.url && (
                                                <a
                                                    href={journal.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                    title="View / Download"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(journal)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

                {journals.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {journals.links.map((link, idx) =>
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

            {selectedJournal && (
                <EditJournalModal
                    show={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setSelectedJournal(null); }}
                    journal={selectedJournal}
                />
            )}
        </AppLayout>
    );
}
