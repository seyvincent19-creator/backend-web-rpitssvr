import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Image {
    id: number;
    image_path: string;
}

interface User {
    id: number;
    name: string;
}

interface Article {
    id: number;
    title: string;
    content: string;
    status: string;
    thumbnail?: string;
    images?: Image[];
    user?: User;
    created_at: string;
    updated_at: string;
}

interface Props {
    article: Article;
}

function storageUrl(path: string) {
    if (!path) return '';
    if (path.startsWith('/storage') || path.startsWith('storage')) {
        return path.startsWith('/') ? path : `/${path}`;
    }
    return `/storage/${path}`;
}

export default function Show({ article }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Articles', href: '/articles' },
            { title: article.title, href: `/articles/${article.id}` },
        ]}>
            <Head title={article.title} />

            <div className="max-w-4xl mx-auto p-6">
                {/* Back button */}
                <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
                >
                    ← Back to Articles
                </Link>

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                            article.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {article.status}
                        </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                        {article.user && <span>By {article.user.name}</span>}
                        <span>Created: {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>Updated: {new Date(article.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>

                {/* Thumbnail */}
                {article.thumbnail && (
                    <div className="mb-6">
                        <img
                            src={storageUrl(article.thumbnail)}
                            alt={article.title}
                            className="w-full max-h-96 object-cover rounded-lg shadow"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Content</h2>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{article.content}</p>
                </div>

                {/* Images */}
                {article.images && article.images.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Images ({article.images.length})</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {article.images.map((img) => (
                                <a
                                    key={img.id}
                                    href={storageUrl(img.image_path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={storageUrl(img.image_path)}
                                        alt=""
                                        className="w-full h-40 object-cover rounded-lg border border-gray-100 hover:opacity-90 transition-opacity cursor-pointer"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
