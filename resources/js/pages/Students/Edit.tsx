import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    last_name_kh: string | null; first_name_kh: string | null;
    last_name_en: string | null; first_name_en: string | null;
    gender: string | null; dob: string | null;
    national_id: string | null;
    phone: string | null; email: string | null;
    province: string | null; address: string | null;
    guardian_name: string | null; guardian_phone: string | null;
    major: string | null; year: string | null;
}

interface Props { student: Student; [key: string]: unknown }

const MAJORS = [
    { value: 'computer_science',         label: 'Computer Science / វិទ្យាសាស្រ្តកុំព្យូទ័រ' },
    { value: 'electrical',               label: 'Electrical / អគ្គិសនី' },
    { value: 'mechatronics',             label: 'Mechatronics / មេកាត្រូនិក' },
    { value: 'industrial_mechanics',     label: 'Industrial Mechanics / មេកានិកឧស្សាហកម្ម' },
    { value: 'electronics',              label: 'Electronics / អេឡិចត្រូនិក' },
    { value: 'automotive',               label: 'Automotive / មេកានិករថយន្ត' },
    { value: 'civil',                    label: 'Civil Engineering / សំណង់ស៊ីវិល' },
    { value: 'refrigeration',            label: 'Refrigeration / បរិក្ខាត្រជាក់' },
    { value: 'english',                  label: 'English / អក្សរសាស្រ្តអង់គ្លេស' },
    { value: 'accounting',               label: 'Accounting / គណនេយ្យ' },
    // legacy Khmer string values stored by old form
    { value: 'វិទ្យាសាស្រ្តកុំព្យូទ័រ',  label: 'Computer Science / វិទ្យាសាស្រ្តកុំព្យូទ័រ' },
    { value: 'អគ្គិសនី',                  label: 'Electrical / អគ្គិសនី' },
    { value: 'មេកាត្រូនិក',               label: 'Mechatronics / មេកាត្រូនិក' },
    { value: 'មេកានិកឧស្សាហកម្ម',         label: 'Industrial Mechanics / មេកានិកឧស្សាហកម្ម' },
    { value: 'អេឡិចត្រូនិក',               label: 'Electronics / អេឡិចត្រូនិក' },
    { value: 'មេកានិករថយន្ត',              label: 'Automotive / មេកានិករថយន្ត' },
    { value: 'សំណង់ស៊ីវិល',               label: 'Civil Engineering / សំណង់ស៊ីវិល' },
    { value: 'ជំនាញបរិក្ខាត្រជាក់',        label: 'Refrigeration / ជំនាញបរិក្ខាត្រជាក់' },
    { value: 'អក្សរសាស្រ្តអង់គ្លេស',       label: 'English / អក្សរសាស្រ្តអង់គ្លេស' },
    { value: 'គណនេយ្យ និងហិរញ្ញវត្ថុ',    label: 'Accounting / គណនេយ្យ' },
];

const PROVINCES = [
    'ភ្នំពេញ', 'ស្វាយរៀង', 'ព្រៃវែង', 'ក្រចេះ', 'មណ្ឌលគិរី',
    'រតនៈគិរី', 'ស្ទឹងត្រែង', 'កំពង់ចាម', 'ត្បូងឃ្មុំ', 'ខេត្តដទៃទៀត',
];

// "Year 4" → "4",  "4" → "4"
function normalizeYear(y: string | null): string {
    if (!y) return '';
    return y.replace(/^Year\s*/i, '').trim();
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

const inputCls = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded-xl outline-none transition focus:ring-2 focus:ring-blue-100 ${
        err ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-blue-500'
    }`;

export default function Edit() {
    const { student } = usePage<Props>().props;
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    // Use uncontrolled inputs (defaultValue) so Inertia SSR/hydration
    // differences don't cause empty fields — data comes straight from props.
    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = Object.fromEntries(fd.entries());
        setProcessing(true);
        router.put(`/students/${student.id}`, payload, {
            onError: (errs) => { setErrors(errs); setProcessing(false); },
            onSuccess: () => setProcessing(false),
        });
    }

    const s = student; // shorthand

    return (
        <AppLayout breadcrumbs={[
            { title: 'Students', href: '/students' },
            { title: `${s.first_name_en ?? ''} ${s.last_name_en ?? ''}`.trim() || `Student #${s.id}`, href: `/students/${s.id}` },
            { title: 'Edit', href: `/students/${s.id}/edit` },
        ]}>
            <Head title={`Edit — ${s.first_name_en ?? ''} ${s.last_name_en ?? ''}`} />
            <div className="p-4 md:p-6 max-w-3xl">

                <Link href={`/students/${s.id}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>

                <form onSubmit={submit}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* Personal */}
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-700 mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Last Name (Khmer)" error={errors.last_name_kh}>
                                    <input name="last_name_kh" defaultValue={s.last_name_kh ?? ''}
                                        className={inputCls(errors.last_name_kh)}
                                        style={{ fontFamily: 'Siemreap, sans-serif' }} />
                                </Field>
                                <Field label="First Name (Khmer)" error={errors.first_name_kh}>
                                    <input name="first_name_kh" defaultValue={s.first_name_kh ?? ''}
                                        className={inputCls(errors.first_name_kh)}
                                        style={{ fontFamily: 'Siemreap, sans-serif' }} />
                                </Field>
                                <Field label="Last Name (Latin)" error={errors.last_name_en}>
                                    <input name="last_name_en" defaultValue={s.last_name_en ?? ''}
                                        className={inputCls(errors.last_name_en)} />
                                </Field>
                                <Field label="First Name (Latin)" error={errors.first_name_en}>
                                    <input name="first_name_en" defaultValue={s.first_name_en ?? ''}
                                        className={inputCls(errors.first_name_en)} />
                                </Field>
                                <Field label="Gender" error={errors.gender}>
                                    <select name="gender" defaultValue={s.gender ?? ''}
                                        className={inputCls(errors.gender)}>
                                        <option value="">— Select —</option>
                                        <option value="male">Male / បុរស</option>
                                        <option value="female">Female / ស្ត្រី</option>
                                    </select>
                                </Field>
                                <Field label="Date of Birth" error={errors.dob}>
                                    <input type="date" name="dob" defaultValue={s.dob ?? ''}
                                        className={inputCls(errors.dob)} />
                                </Field>
                                <Field label="National ID" error={errors.national_id}>
                                    <input name="national_id" defaultValue={s.national_id ?? ''}
                                        className={inputCls(errors.national_id)} />
                                </Field>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-700 mb-4">Contact Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Phone *" error={errors.phone}>
                                    <input name="phone" defaultValue={s.phone ?? ''}
                                        className={inputCls(errors.phone)} />
                                </Field>
                                <Field label="Email" error={errors.email}>
                                    <input type="email" name="email" defaultValue={s.email ?? ''}
                                        className={inputCls(errors.email)} />
                                </Field>
                                <Field label="Province" error={errors.province}>
                                    <select name="province" defaultValue={s.province ?? ''}
                                        className={inputCls(errors.province)}
                                        style={{ fontFamily: 'Siemreap, sans-serif' }}>
                                        <option value="">— Select —</option>
                                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </Field>
                                <Field label="Address" error={errors.address}>
                                    <input name="address" defaultValue={s.address ?? ''}
                                        className={inputCls(errors.address)}
                                        style={{ fontFamily: 'Siemreap, sans-serif' }} />
                                </Field>
                            </div>
                        </div>

                        {/* Guardian */}
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-700 mb-4">Guardian Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Guardian Name" error={errors.guardian_name}>
                                    <input name="guardian_name" defaultValue={s.guardian_name ?? ''}
                                        className={inputCls(errors.guardian_name)}
                                        style={{ fontFamily: 'Siemreap, sans-serif' }} />
                                </Field>
                                <Field label="Guardian Phone" error={errors.guardian_phone}>
                                    <input name="guardian_phone" defaultValue={s.guardian_phone ?? ''}
                                        className={inputCls(errors.guardian_phone)} />
                                </Field>
                            </div>
                        </div>

                        {/* Academic */}
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-700 mb-4">Academic Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Major *" error={errors.major}>
                                    <select name="major" defaultValue={s.major ?? ''}
                                        className={inputCls(errors.major)}>
                                        <option value="">— Select Major —</option>
                                        {MAJORS.filter((m, i, arr) => arr.findIndex(x => x.value === m.value) === i)
                                            .map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                </Field>
                                <Field label="Year *" error={errors.year}>
                                    <select name="year" defaultValue={normalizeYear(s.year)}
                                        className={inputCls(errors.year)}>
                                        <option value="">— Select Year —</option>
                                        <option value="1">Year 1</option>
                                        <option value="2">Year 2</option>
                                        <option value="3">Year 3</option>
                                        <option value="4">Year 4</option>
                                    </select>
                                </Field>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                            <Link href={`/students/${s.id}`}
                                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing}
                                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-60">
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
