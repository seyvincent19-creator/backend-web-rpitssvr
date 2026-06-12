import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';

interface Student {
    id: number;
    last_name_kh: string; first_name_kh: string;
    last_name_en: string; first_name_en: string;
    gender: string | null; dob: string | null;
    national_id: string | null;
    phone: string; email: string | null;
    province: string | null; address: string | null;
    guardian_name: string | null; guardian_phone: string | null;
    major: string; year: string;
    photo_path: string | null;
    created_at: string;
}

interface Props { student: Student }

const MAJOR_LABELS: Record<string, string> = {
    computer_science: 'Computer Science', electrical: 'Electrical',
    mechatronics: 'Mechatronics', industrial_mechanics: 'Industrial Mechanics',
    electronics: 'Electronics', automotive: 'Automotive',
    civil: 'Civil Engineering', refrigeration: 'Refrigeration',
    english: 'English', accounting: 'Accounting',
};

function storageUrl(path: string) {
    if (!path) return '';
    return path.startsWith('/storage') || path.startsWith('storage')
        ? path.startsWith('/') ? path : `/${path}`
        : `/storage/${path}`;
}

function Row({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-gray-50 last:border-0">
            <span className="w-44 flex-shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider pt-0.5">{label}</span>
            <span className="text-sm text-gray-800">{value || <span className="text-gray-300 italic">—</span>}</span>
        </div>
    );
}

export default function Show() {
    const { student } = usePage<Props>().props;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Students', href: '/students' },
            { title: `${student.first_name_en} ${student.last_name_en}`, href: `/students/${student.id}` },
        ]}>
            <Head title={`${student.first_name_en} ${student.last_name_en}`} />
            <div className="p-4 md:p-6 max-w-3xl">

                {/* Back + Edit */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/students" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Students
                    </Link>
                    <Link
                        href={`/students/${student.id}/edit`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                        <Pencil className="w-4 h-4" /> Edit
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Profile header */}
                    <div className="flex items-center gap-5 p-6 border-b border-gray-100 bg-gray-50">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-200">
                            {student.photo_path ? (
                                <img src={storageUrl(student.photo_path)} alt="Photo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400 uppercase">
                                    {student.first_name_en?.[0] ?? '?'}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {student.first_name_en} {student.last_name_en}
                            </h1>
                            <p className="text-gray-500 mt-0.5" style={{ fontFamily: 'Siemreap, sans-serif' }}>
                                {student.first_name_kh} {student.last_name_kh}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                    Year {student.year}
                                </span>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">
                                    {MAJOR_LABELS[student.major] ?? student.major}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-0">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Personal Info</p>
                        <Row label="Gender" value={student.gender} />
                        <Row label="Date of Birth" value={student.dob ?? undefined} />
                        <Row label="National ID" value={student.national_id} />

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-5 mb-2">Contact</p>
                        <Row label="Phone" value={student.phone} />
                        <Row label="Email" value={student.email} />
                        <Row label="Province" value={student.province} />
                        <Row label="Address" value={student.address} />

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-5 mb-2">Guardian</p>
                        <Row label="Guardian Name" value={student.guardian_name} />
                        <Row label="Guardian Phone" value={student.guardian_phone} />

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-5 mb-2">Academic</p>
                        <Row label="Major" value={MAJOR_LABELS[student.major] ?? student.major} />
                        <Row label="Year" value={`Year ${student.year}`} />
                        <Row label="Registered" value={new Date(student.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
