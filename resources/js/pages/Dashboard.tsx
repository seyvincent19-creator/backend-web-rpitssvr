import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    BookText,
    Building2,
    FileText,
    GraduationCap,
    LayoutDashboard,
    Layers,
    PlusCircle,
    TrendingUp,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface Article {
    id: number;
    title: string;
    status: string;
    created_at: string;
    thumbnail?: string;
    user?: { name: string };
}

interface Stats {
    articles: number;
    published: number;
    draft: number;
    ebooks: number;
    departments: number;
    thesis: number;
    courses: number;
}

interface Props {
    stats: Stats;
    recentArticles: Article[];
    authUser: { name: string; email: string };
}

function storageUrl(path: string) {
    if (!path) return '';
    return path.startsWith('/storage') || path.startsWith('storage')
        ? path.startsWith('/') ? path : `/${path}`
        : `/storage/${path}`;
}

function StatCard({
    label,
    value,
    icon: Icon,
    accent,
    sub,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    accent: string;
    sub?: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm font-medium text-gray-500 mt-0.5">{label}</p>
                {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
            </div>
        </div>
    );
}

const quickLinks = [
    { label: 'New Article', href: '/articles', icon: FileText, color: 'bg-blue-600' },
    { label: 'New Ebook', href: '/ebooks', icon: BookOpen, color: 'bg-emerald-600' },
    { label: 'New Department', href: '/departments', icon: Building2, color: 'bg-violet-600' },
    { label: 'New Thesis', href: '/thesis', icon: GraduationCap, color: 'bg-amber-500' },
];

export default function Dashboard({ stats, recentArticles, authUser }: Props) {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* ── Welcome banner ── */}
                <div
                    className="relative overflow-hidden rounded-2xl px-6 py-7 text-white"
                    style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)' }}
                >
                    {/* decorative circles */}
                    <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
                    <div className="pointer-events-none absolute top-4 right-16 w-20 h-20 rounded-full bg-white/5" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-blue-200 text-sm font-medium">{greeting},</p>
                            <h1 className="text-2xl font-bold mt-0.5">{authUser.name}</h1>
                            <p className="text-blue-200 text-sm mt-1">
                                {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 backdrop-blur-sm w-fit">
                            <TrendingUp className="w-4 h-4 text-blue-100" />
                            <span className="text-sm text-blue-50 font-medium">
                                {stats.published} published · {stats.draft} drafts
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Stat cards ── */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Overview
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Articles"
                            value={stats.articles}
                            icon={FileText}
                            accent="bg-blue-600"
                            sub={`${stats.published} published`}
                        />
                        <StatCard
                            label="E-Books"
                            value={stats.ebooks}
                            icon={BookOpen}
                            accent="bg-emerald-600"
                        />
                        <StatCard
                            label="Departments"
                            value={stats.departments}
                            icon={Building2}
                            accent="bg-violet-600"
                        />
                        <StatCard
                            label="Thesis"
                            value={stats.thesis}
                            icon={GraduationCap}
                            accent="bg-amber-500"
                        />
                        <StatCard
                            label="Courses"
                            value={stats.courses}
                            icon={Layers}
                            accent="bg-rose-500"
                        />
                        <StatCard
                            label="Published"
                            value={stats.published}
                            icon={BookText}
                            accent="bg-teal-600"
                        />
                        <StatCard
                            label="Drafts"
                            value={stats.draft}
                            icon={FileText}
                            accent="bg-gray-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Recent Articles ── */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" /> Recent Articles
                            </h2>
                            <Link href="/articles" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                View all →
                            </Link>
                        </div>

                        {recentArticles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <FileText className="w-10 h-10 mb-2 opacity-30" />
                                <p className="text-sm">No articles yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {recentArticles.map((article) => (
                                    <div key={article.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                                        {/* Thumbnail */}
                                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                            {article.thumbnail ? (
                                                <img
                                                    src={storageUrl(article.thumbnail)}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FileText className="w-4 h-4 text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/articles/${article.id}`}
                                                className="text-sm font-medium text-gray-800 hover:text-blue-600 truncate block"
                                            >
                                                {article.title}
                                            </Link>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {article.user?.name ?? 'Unknown'} ·{' '}
                                                {new Date(article.created_at).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric',
                                                })}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                            article.status === 'published'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {article.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Quick Actions ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <PlusCircle className="w-4 h-4 text-blue-600" /> Quick Actions
                            </h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {quickLinks.map(({ label, href, icon: Icon, color }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} flex-shrink-0`}>
                                        <Icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                        {label}
                                    </span>
                                    <span className="ml-auto text-gray-300 group-hover:text-blue-400 text-xs">→</span>
                                </Link>
                            ))}
                        </div>

                        {/* Article breakdown mini chart */}
                        <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Article Status</p>
                            <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                                {stats.articles > 0 ? (
                                    <>
                                        <div
                                            className="bg-blue-500 rounded-l-full"
                                            style={{ width: `${(stats.published / stats.articles) * 100}%` }}
                                        />
                                        <div
                                            className="bg-yellow-400 rounded-r-full"
                                            style={{ width: `${(stats.draft / stats.articles) * 100}%` }}
                                        />
                                    </>
                                ) : (
                                    <div className="bg-gray-200 rounded-full w-full" />
                                )}
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                    Published ({stats.published})
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                                    Drafts ({stats.draft})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
