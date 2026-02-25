import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Wallet, CheckCircle2, Copy, Building2, User, Fingerprint, ExternalLink, ShieldCheck } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore } from '../store/useAuthStore';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    items?: any[];
    onSuccess?: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, total, items = [], onSuccess }) => {
    const { user, setAuthModalOpen } = useAuthStore();
    const [step, setStep] = useState<'auth' | 'select' | 'processing' | 'bank_details' | 'external_payment' | 'success'>(user ? 'select' : 'auth');
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [orderId, setOrderId] = useState('');
    const { addOrder } = useOrderStore();
    const { settings } = useSettingsStore();

    // Detectar retorno de Mercado Pago
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const externalRef = params.get('external_reference') || params.get('orderId');

        if (status === 'success' && isOpen) {
            setPaymentMethod('Mercado Pago');
            setOrderId(externalRef || `ORD-${Math.floor(Math.random() * 900 + 100)}`);
            completeOrder();
            // Limpiar URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [isOpen]);

    // Resetear paso al abrir
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (isOpen && params.get('status') !== 'success') {
            setStep(user ? 'select' : 'auth');
        }
    }, [isOpen, user]);

    const handlePayment = async (method: string) => {
        if (method === 'Mayorista' && !user) {
            alert('La opción "Solo Mayoristas" es exclusiva para clientes registrados. Por favor, inicia sesión o crea una cuenta.');
            setStep('auth');
            return;
        }

        setPaymentMethod(method);

        if (method === 'Transferencia') {
            setStep('bank_details');
            return;
        }

        if (method === 'Mercado Pago' || method === 'Mayorista') {
            setStep('external_payment');

            try {
                const orderId = `ORD-${Date.now().toString().slice(-6)}`;
                const finalDiscount = method === 'Mercado Pago' ? settings.mercadoPagoDiscount : 0;

                if (method === 'Mercado Pago') {
                    const response = await fetch('http://localhost:3001/create_preference', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderId,
                            items: items.map(i => ({
                                productName: i.product.name,
                                quantity: i.quantity,
                                price: i.product.price * (1 - finalDiscount / 100)
                            })),
                            rootUrl: window.location.origin
                        })
                    });

                    const data = await response.json();
                    if (data.init_point) {
                        window.location.href = data.init_point;
                        return;
                    } else {
                        throw new Error("No se pudo obtener el punto de inicio de pago");
                    }
                }

                // Opción Mayorista
                if (method === 'Mayorista') {
                    setStep('processing');
                    setTimeout(() => {
                        completeOrder();
                    }, 5000); // 5 segundos para que parezca que se está registrando
                }
            } catch (error) {
                console.error("Error creating payment:", error);
                alert("Hubo un error al conectar con Mercado Pago. Asegúrate de tener el servidor corriendo.");
                setStep('select');
            }
            return;
        }

        setStep('external_payment');
    };

    const completeOrder = () => {
        const newOrderId = `ORD-${Math.floor(Math.random() * 900 + 100)}`;
        setOrderId(newOrderId);

        let finalDiscount = 0;
        if (paymentMethod === 'Transferencia') finalDiscount = settings.bankDiscount;
        if (paymentMethod === 'Mercado Pago') finalDiscount = settings.mercadoPagoDiscount;

        const finalTotal = total * (1 - finalDiscount / 100);

        addOrder({
            customerName: user?.name || 'Invitado',
            customerLastName: user?.lastName || (user ? '' : 'Invitado'),
            customerEmail: user?.email || 'invitado@ejemplo.com',
            customerPhone: user?.phone || 'S/D',
            customerAddress: user?.address || 'S/D',
            customerDNI: user?.docNumber || 'S/D',
            items: items.map(i => ({ productName: i.product.name, quantity: i.quantity, price: i.product.price })),
            total: finalTotal,
            trackingNumber: ''
        });

        if (onSuccess) onSuccess();
        setStep('success');
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} copiado al portapapeles`);
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
                    />
                    <div className="fixed inset-0 z-[201] overflow-y-auto flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden my-auto"
                        >
                            <div className="max-h-[90vh] overflow-y-auto p-8">
                                {step === 'auth' && (
                                    <div className="py-6 text-center">
                                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-[28px] flex items-center justify-center mx-auto mb-8">
                                            <User size={36} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-4 display-font">¡Ya casi es tuyo!</h2>
                                        <p className="text-slate-400 text-sm mb-10 italic px-4">Para una mejor experiencia, inicia sesión o continúa como invitado.</p>

                                        <div className="space-y-4">
                                            <button
                                                onClick={() => setAuthModalOpen(true)}
                                                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-3"
                                            >
                                                Iniciar Sesión o Crear Cuenta
                                            </button>

                                            <div className="flex items-center gap-4 py-2">
                                                <div className="flex-1 h-px bg-slate-100" />
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">o bien</span>
                                                <div className="flex-1 h-px bg-slate-100" />
                                            </div>

                                            <button
                                                onClick={() => setStep('select')}
                                                className="w-full bg-slate-50 text-slate-600 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                                            >
                                                Continuar como Invitado
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 'select' && (
                                    <>
                                        <div className="flex justify-between items-center mb-8">
                                            <h2 className="text-2xl font-bold font-serif">Finalizar Compra</h2>
                                            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
                                        </div>

                                        <div className="bg-[#fdfaf6] p-6 rounded-2xl mb-8 border border-primary/10">
                                            <span className="text-sm text-text-muted block mb-1">Total a pagar</span>
                                            <span className="text-4xl font-bold text-primary">${total.toLocaleString('es-AR')}</span>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <button
                                                onClick={() => handlePayment('Mercado Pago')}
                                                className="flex items-center gap-4 p-5 rounded-2xl border-2 border-transparent hover:border-primary bg-primary/5 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                    <Wallet className="text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-bold block text-sm">Mercado Pago</span>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] text-text-muted">Tarjetas y cuotas</span>
                                                        {settings.mercadoPagoDiscount > 0 && (
                                                            <span className="text-[10px] text-green-600 font-bold leading-none bg-green-50 px-2 py-1 rounded-md">{settings.mercadoPagoDiscount}% OFF</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handlePayment('Mayorista')}
                                                className="flex items-center gap-4 p-5 rounded-2xl border-2 border-transparent hover:border-slate-800 bg-slate-50 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                    <Building2 className="text-slate-800" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-bold block text-sm">Solo Mayoristas</span>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Acordar con el vendedor</span>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handlePayment('Transferencia')}
                                                className="flex items-center gap-4 p-5 rounded-2xl border-2 border-transparent hover:border-amber-600 bg-amber-50 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                    <CreditCard className="text-amber-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-bold block text-sm">Transferencia</span>
                                                    <span className="text-[10px] text-amber-700 font-bold">{settings.bankDiscount}% OFF DIRECTO</span>
                                                </div>
                                            </button>
                                        </div>
                                    </>
                                )}

                                {step === 'bank_details' && (
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-bold font-serif text-amber-800 leading-none">Datos Bancarios</h3>
                                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest italic">{settings.bankDiscount}% de descuento aplicado</p>
                                            </div>
                                            <button onClick={() => setStep('select')} className="text-xs font-bold text-gray-400 hover:text-gray-600">Volver</button>
                                        </div>

                                        <div className="bg-amber-100/30 p-6 rounded-[24px] border border-amber-100 flex items-center justify-between">
                                            <span className="text-sm font-bold text-amber-900">Total con Descuento:</span>
                                            <span className="text-3xl font-black text-amber-600 font-serif">${(total * (1 - settings.bankDiscount / 100)).toLocaleString('es-AR')}</span>
                                        </div>

                                        <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl space-y-6">
                                            <div className="space-y-4">
                                                <BankField icon={<Building2 size={16} />} label="Entidad" value={settings.bankName || 'No config.'} />
                                                <BankField icon={<User size={16} />} label="Titular" value={settings.bankHolder || 'No config.'} onCopy={() => copyToClipboard(settings.bankHolder, 'Titular')} />
                                                <BankField icon={<Fingerprint size={16} />} label="CBU / CVU" value={settings.bankCBU || 'No config.'} onCopy={() => copyToClipboard(settings.bankCBU, 'CBU')} />
                                                <BankField icon={<CheckCircle2 size={16} />} label="ALIAS" value={settings.bankAlias || 'No config.'} onCopy={() => copyToClipboard(settings.bankAlias, 'Alias')} highlight />
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                                            <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                                            <p className="text-[10px] font-medium text-gray-500 leading-relaxed">
                                                Al finalizar, envíanos el comprobante por WhatsApp adjuntando tu número de pedido para confirmar el despacho.
                                            </p>
                                        </div>

                                        <button
                                            onClick={completeOrder}
                                            className="w-full bg-amber-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-105 transition-all shadow-xl shadow-amber-600/20 flex items-center justify-center gap-3"
                                        >
                                            Confirmar y Notificar
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                )}

                                {step === 'external_payment' && (
                                    <div className="py-12 text-center space-y-8 animate-fade-in">
                                        <div className="relative mx-auto w-24 h-24">
                                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                                            <div className="relative w-full h-full bg-white border border-gray-100 rounded-3xl shadow-xl flex items-center justify-center">
                                                {paymentMethod === 'Mayorista' ? <Building2 className="text-slate-800" size={40} /> : <Wallet className="text-primary" size={40} />}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-bold uppercase tracking-tight">Abriendo {paymentMethod}</h3>
                                                <p className="text-xs text-gray-400 font-medium px-8 italic">Completa la transacción en la plataforma segura para volver a Dos Lidias.</p>
                                            </div>

                                            {paymentMethod === 'Mercado Pago' && settings.mercadoPagoDiscount > 0 && (
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mx-4">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-black uppercase text-slate-400">Beneficio Aplicado</span>
                                                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                            -{(paymentMethod === 'Mercado Pago' ? settings.mercadoPagoDiscount : 0)}% OFF
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-baseline">
                                                        <span className="text-xs font-bold text-slate-500">Total Final:</span>
                                                        <span className="text-2xl font-black text-primary animate-pulse">
                                                            ${(total * (1 - (paymentMethod === 'Mercado Pago' ? settings.mercadoPagoDiscount : 0) / 100)).toLocaleString('es-AR')}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="h-1 w-32 bg-gray-100 mx-auto rounded-full overflow-hidden">
                                            <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]"></div>
                                        </div>
                                    </div>
                                )}

                                {step === 'processing' && (
                                    <div className="py-20 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                                        <h3 className="text-xl font-bold mb-2">
                                            {paymentMethod === 'Mayorista' ? 'Registrando Pedido' : 'Comprobando Pago'}
                                        </h3>
                                        <p className="text-text-muted text-sm italic">
                                            {paymentMethod === 'Mayorista'
                                                ? 'Estamos procesando tu solicitud mayorista...'
                                                : `Estamos recibiendo la confirmación de ${paymentMethod}...`}
                                        </p>
                                    </div>
                                )}

                                {step === 'success' && (
                                    <div className="py-8 flex flex-col items-center justify-center text-center">
                                        <div className="relative mb-8">
                                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center z-10 relative">
                                                <CheckCircle2 size={48} />
                                            </div>
                                            <div className="absolute top-0 left-0 w-24 h-24 bg-green-400/20 rounded-full animate-ping -z-10"></div>
                                        </div>

                                        <h3 className="text-3xl font-bold mb-3 font-serif">¡Gracias por elegirnos!</h3>
                                        <p className="text-gray-500 mb-8 text-sm px-6 italic">
                                            {paymentMethod === 'Mayorista' || paymentMethod === 'Transferencia'
                                                ? 'Tu pedido ha sido registrado. Por favor, ponte en contacto con nosotros para confirmar la compra y coordinar la entrega.'
                                                : 'Tu pedido ha sido registrado correctamente. A continuación tienes los detalles para el seguimiento.'}
                                        </p>

                                        <div className="w-full bg-[#f8fafc] p-6 rounded-[32px] border border-gray-100 mb-6 shadow-inner">
                                            <p className="text-[10px] uppercase font-black text-gray-300 tracking-[0.2em] mb-3">Nº Identificador de Pedido</p>
                                            <div className="flex items-center justify-center gap-3">
                                                <span className="text-3xl font-mono font-black text-primary tracking-tighter">{orderId}</span>
                                                <button
                                                    onClick={() => copyToClipboard(orderId, 'Nro de Pedido')}
                                                    className="p-2.5 bg-white border border-gray-100 shadow-sm rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {(paymentMethod === 'Mayorista' || paymentMethod === 'Transferencia') && (
                                            <a
                                                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hola! Acabo de realizar un pedido (${paymentMethod}) con el Nº: ${orderId}. Me gustaría confirmarlo.`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-[#25D366] text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 mb-4"
                                            >
                                                <CheckCircle2 size={20} />
                                                Confirmar por WhatsApp
                                            </a>
                                        )}

                                        <button
                                            onClick={onClose}
                                            className="w-full bg-slate-900 text-slate-400 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:text-white transition-all"
                                        >
                                            Cerrar ventana
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

const BankField: React.FC<{ icon: React.ReactNode, label: string, value: string, onCopy?: () => void, highlight?: boolean }> = ({ icon, label, value, onCopy, highlight }) => (
    <div className="space-y-1.5 group">
        <div className="flex items-center gap-2 text-gray-400">
            {icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${highlight ? 'bg-white border-amber-200 shadow-sm' : 'bg-transparent border-gray-100'}`}>
            <span className={`text-xs font-bold truncate pr-4 ${highlight ? 'text-primary' : 'text-gray-700'}`}>{value}</span>
            {onCopy && (
                <button
                    onClick={onCopy}
                    className="p-1.5 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                    <Copy size={14} />
                </button>
            )}
        </div>
    </div>
);

export default CheckoutModal;
