import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Loader2, Calendar, Fingerprint, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const { login, register, status } = useAuthStore();

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Register specific states
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [docType, setDocType] = useState('DNI');
    const [otherDocType, setOtherDocType] = useState('');
    const [docNumber, setDocNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'register') {
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            // Validation for DNI
            if (docType === 'DNI' && (!/^\d{8}$/.test(docNumber))) {
                alert('El DNI debe tener 8 dígitos numéricos');
                return;
            }

            await register({
                name,
                lastName,
                email,
                birthDate,
                docType,
                docNumber,
                phone,
                address,
                otherDocType: docType === 'Otro' ? otherDocType : undefined
            }, password);
        } else {
            await login(email, password);
        }
        onClose();
    };

    const handleDocNumberChange = (val: string) => {
        if (docType === 'DNI') {
            // Only numbers, max 8
            const clean = val.replace(/\D/g, '').slice(0, 8);
            setDocNumber(clean);
        } else {
            setDocNumber(val);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[998]"
                    />
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 overflow-y-auto outline-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="bg-white w-full max-w-lg rounded-[40px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative my-auto"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors z-10"
                            >
                                <X size={20} className="text-slate-400" />
                            </button>

                            <div className="p-8 md:p-12 max-h-[85vh] overflow-y-auto">
                                <div className="mb-10 text-center">
                                    <h2 className="text-3xl font-black text-slate-900 display-font mb-2">
                                        {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                                    </h2>
                                    <p className="text-slate-400 text-sm font-medium italic">
                                        {mode === 'login' ? 'Tus piezas favoritas te están esperando.' : 'Únete a Dos Lidias y sigue tus pedidos.'}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {mode === 'register' && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Nombre</label>
                                                    <div className="relative">
                                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                                        <input
                                                            type="text" required placeholder="Ariel"
                                                            className="auth-input pl-14"
                                                            value={name} onChange={e => setName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Apellido</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text" required placeholder="Garcia"
                                                            className="auth-input pl-6"
                                                            value={lastName} onChange={e => setLastName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Fecha de Nacimiento</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                                    <input
                                                        type="date" required
                                                        className="auth-input pl-14 pr-6"
                                                        value={birthDate} onChange={e => setBirthDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Tipo de Doc.</label>
                                                    <select
                                                        className="auth-input px-6 appearance-none cursor-pointer"
                                                        value={docType} onChange={e => { setDocType(e.target.value); setDocNumber(''); }}
                                                    >
                                                        <option value="DNI">DNI</option>
                                                        <option value="Pasaporte">Pasaporte</option>
                                                        <option value="Otro">Otro</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Nro. de Documento</label>
                                                    <div className="relative">
                                                        <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                                        <input
                                                            type="text" required
                                                            placeholder={docType === 'DNI' ? '12345678' : 'ABC1234'}
                                                            className="auth-input pl-14"
                                                            value={docNumber} onChange={e => handleDocNumberChange(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {docType === 'Otro' && (
                                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Especifique Tipo</label>
                                                    <input
                                                        type="text" required placeholder="Ej: Cédula"
                                                        className="auth-input px-6"
                                                        value={otherDocType} onChange={e => setOtherDocType(e.target.value)}
                                                    />
                                                </motion.div>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Teléfono</label>
                                                    <div className="relative">
                                                        <input
                                                            type="tel" required placeholder="+54 11 ..."
                                                            className="auth-input px-6"
                                                            value={phone} onChange={e => setPhone(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Domicilio</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text" required placeholder="Calle 123, Ciudad"
                                                            className="auth-input px-6"
                                                            value={address} onChange={e => setAddress(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <input
                                                type="email" required placeholder="tu@email.com"
                                                className="auth-input pl-14"
                                                value={email} onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{mode === 'login' ? 'Contraseña' : 'Crear Contraseña'}</label>
                                            <div className="relative">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required placeholder="••••••••"
                                                    className="auth-input pl-14 pr-12"
                                                    value={password} onChange={e => setPassword(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        {mode === 'register' && (
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Repetir Contraseña</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        required placeholder="••••••••"
                                                        className="auth-input px-6"
                                                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                {mode === 'login' ? 'Entrar' : 'Crear Cuenta'}
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div className="p-8 bg-slate-50 text-center">
                                <p className="text-sm text-slate-400 font-medium italic">
                                    {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya eres parte?'}
                                    <button
                                        onClick={() => {
                                            setMode(mode === 'login' ? 'register' : 'login');
                                            setShowPassword(false);
                                        }}
                                        className="ml-2 text-primary font-black not-italic border-b-2 border-primary/20 hover:border-primary transition-all"
                                    >
                                        {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
