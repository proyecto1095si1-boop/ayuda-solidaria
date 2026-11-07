'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ChevronRight, ChevronLeft, Upload } from 'lucide-react';

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán',
];

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<'DONOR' | 'BENEFICIARY'>('DONOR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    dni: '',
    birthDate: '',
    phone: '',
    address: '',
    province: '',
    city: '',
    cbu: '',
    alias: '',
    accountHolder: '',
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canNextStep1 =
    form.fullName.length >= 2 &&
    form.email.includes('@') &&
    form.password.length >= 8 &&
    form.password === form.passwordConfirm;

  const canNextStep2 =
    role === 'DONOR' ||
    (form.dni.length >= 7 &&
      form.birthDate &&
      form.phone &&
      form.address &&
      form.province &&
      form.city);

  const canSubmit =
    role === 'DONOR' ||
    (form.cbu.length === 22 && form.alias && form.accountHolder);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      // const res = await api.post('/auth/register', { ...form, role });
      // localStorage.setItem('token', res.data.accessToken);
      if (role === 'BENEFICIARY') {
        router.push('/dashboard?welcome=beneficiary');
      } else {
        router.push('/campanas');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-10">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
          <Heart className="h-7 w-7 fill-primary text-primary" />
          Ayuda Solidaria
        </Link>
        <p className="mt-2 text-muted-foreground">Creá tu cuenta gratis</p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`h-0.5 w-8 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* STEP 1: Cuenta */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Datos de la cuenta</h2>

            <div>
              <label className="mb-2 block text-sm font-medium">¿Qué querés hacer?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('DONOR')}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    role === 'DONOR'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'hover:bg-accent'
                  }`}
                >
                  <p className="font-medium">Donar</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Quiero ayudar a causas
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('BENEFICIARY')}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    role === 'BENEFICIARY'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'hover:bg-accent'
                  }`}
                >
                  <p className="font-medium">Pedir ayuda</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Crear una campaña
                  </p>
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Nombre completo</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Confirmar contraseña</label>
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={(e) => update('passwordConfirm', e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <button
              type="button"
              disabled={!canNextStep1}
              onClick={() => setStep(role === 'DONOR' ? 3 : 2)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Continuar
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Datos personales (solo beneficiario) */}
        {step === 2 && role === 'BENEFICIARY' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Datos personales</h2>
            <p className="text-sm text-muted-foreground">
              Necesarios para verificar tu identidad. Solo visibles para el equipo de Ayuda Solidaria.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">DNI</label>
                <input
                  type="text"
                  value={form.dni}
                  onChange={(e) => update('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="30123456"
                  className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Fecha de nacimiento</label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => update('birthDate', e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Teléfono</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="11 1234-5678"
                className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Dirección</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Provincia</label>
                <select
                  value={form.province}
                  onChange={(e) => update('province', e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar</option>
                  {PROVINCIAS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Ciudad</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="rounded-xl border border-dashed p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Foto DNI frente y dorso</p>
              <p className="text-xs text-muted-foreground">
                Podés subirlas después desde tu panel
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium hover:bg-accent"
              >
                <ChevronLeft className="h-4 w-4" />
                Atrás
              </button>
              <button
                type="button"
                disabled={!canNextStep2}
                onClick={() => setStep(3)}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Continuar
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Bancarios o confirmación donante */}
        {step === 3 && (
          <div className="space-y-4">
            {role === 'BENEFICIARY' ? (
              <>
                <h2 className="text-lg font-semibold">Datos bancarios</h2>
                <p className="text-sm text-muted-foreground">
                  Ahí depositaremos los fondos de tus campañas. Solo visibles para administradores.
                </p>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">CBU (22 dígitos)</label>
                  <input
                    type="text"
                    value={form.cbu}
                    onChange={(e) => update('cbu', e.target.value.replace(/\D/g, '').slice(0, 22))}
                    placeholder="0000000000000000000000"
                    className="w-full rounded-lg border bg-background px-4 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Alias</label>
                  <input
                    type="text"
                    value={form.alias}
                    onChange={(e) => update('alias', e.target.value)}
                    placeholder="mi.alias.mp"
                    className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Titular de la cuenta</label>
                  <input
                    type="text"
                    value={form.accountHolder}
                    onChange={(e) => update('accountHolder', e.target.value)}
                    className="w-full rounded-lg border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">¡Listo para donar!</h2>
                <p className="text-sm text-muted-foreground">
                  Tu cuenta de donante está casi lista. Confirmá para finalizar el registro.
                </p>
              </>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(role === 'DONOR' ? 1 : 2)}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium hover:bg-accent"
              >
                <ChevronLeft className="h-4 w-4" />
                Atrás
              </button>
              <button
                type="button"
                disabled={!canSubmit || loading}
                onClick={handleSubmit}
                className="flex h-11 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Ingresá
        </Link>
      </p>
    </div>
  );
}
