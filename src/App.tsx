import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import TrackingModal from './components/TrackingModal';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './components/Logo';
import { useProductStore } from './store/useProductStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useAuthStore } from './store/useAuthStore';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import { MessageCircle, Truck, ShieldCheck, Palette, MapPin } from 'lucide-react';

function App() {
    const { products } = useProductStore();
    const { settings } = useSettingsStore();
    const { isAuthModalOpen, setAuthModalOpen } = useAuthStore();
    const [cartItems, setCartItems] = useState<{ product: any; quantity: number }[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (settings.heroImages && settings.heroImages.length > 1) {
            const timer = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % settings.heroImages.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [settings.heroImages]);

    const path = window.location.pathname.replace(/\/$/, '');
    const isAdminPage = path === '/admin';
    if (isAdminPage) return <AdminPanel />;

    const addToCart = (product: any) => {
        if (settings.isVacationMode) {
            alert('La tienda se encuentra en modo pausa. ¡Volvemos pronto!');
            return;
        }
        setCartItems(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="w-full">
            <Navbar
                cartCount={cartCount}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenTracking={() => setIsTrackingOpen(true)}
            />

            {/* Hero Section */}
            <header className="relative w-full py-12 md:py-32 flex items-center overflow-hidden bg-[#faf7f2] mt-16 md:mt-20">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center md:text-left"
                    >
                        <span className="text-primary font-bold tracking-[0.2em] mb-4 block text-xs md:text-sm">ARTE EN BARRO</span>
                        <h1 className="text-4xl md:text-6xl mb-6 leading-tight">
                            {settings.heroTitle.split(' ').map((word, i) =>
                                i === settings.heroTitle.split(' ').length - 1 ?
                                    <span key={i} className="italic text-primary"> {word}</span> : word + ' '
                            )}
                        </h1>
                        <p className="text-lg md:text-xl text-text-muted mb-10 max-w-lg">
                            {settings.heroSubtitle}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <a href="#tienda" className="btn-primary w-full sm:w-auto">Ver Catálogo</a>
                            <button
                                onClick={() => setIsTrackingOpen(true)}
                                className="w-full sm:w-auto px-8 py-3 border border-border rounded-full hover:bg-black/5 font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <Truck size={20} /> Seguir mi Pedido
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative h-[350px] md:h-[500px] w-full"
                    >
                        <div className="hero-img-container shadow-2xl relative w-full h-full overflow-hidden rounded-[40px]">
                            <AnimatePresence mode="wait">
                                {settings.heroImages && settings.heroImages.length > 0 ? (
                                    <motion.img
                                        key={currentImageIndex}
                                        src={settings.heroImages[currentImageIndex]}
                                        alt="Main Art"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300 italic">
                                        Sin imágenes configuradas
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Slide Indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                                {settings.heroImages?.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${currentImageIndex === idx
                                            ? 'bg-white w-8 shadow-lg'
                                            : 'bg-white/40 hover:bg-white/60'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Vacation Banner */}
            {settings.isVacationMode && (
                <div className="bg-primary text-white py-4 px-4 text-center font-bold sticky top-16 z-40 shadow-lg text-sm md:text-base">
                    🏝️ LA TIENDA SE ENCUENTRA EN MODO PAUSA POR VACACIONES.
                </div>
            )}

            {/* Features */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                            <Palette size={28} />
                        </div>
                        <h3 className="text-xl mb-3 font-bold text-primary">100% Intervenidas</h3>
                        <p className="text-text-muted">Cada pieza es pintada a mano, asegurando que no existan dos iguales.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-6">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl mb-3 font-bold" style={{ color: 'var(--secondary)' }}>Calidad Premium</h3>
                        <p className="text-text-muted">Utilizamos lacas y selladores de alta resistencia para exterior.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-border rounded-full flex items-center justify-center text-text-main mb-6">
                            <MapPin size={28} />
                        </div>
                        <h3 className="text-xl mb-3 font-bold">Envíos y Retiros</h3>
                        <p className="text-text-muted">{settings.shippingInfo}</p>
                    </div>
                </div>
            </section>

            {/* Store Section */}
            <section id="tienda" className="py-24 bg-[#fdfaf6]">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8">
                        <div>
                            <h2 className="text-5xl md:text-7xl mb-4 text-text-main">La Tienda</h2>
                            <p className="text-text-muted text-lg italic">Objetos con alma para tus espacios.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-16">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                        ))}
                    </div>
                </div>
            </section>

            {/* WhatsApp FAB */}
            <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-[100]"
            >
                <MessageCircle size={32} />
            </a>

            {/* Footer */}
            <footer className="py-16 bg-[#fafaf8]">
                <div className="container mx-auto px-6 text-center flex flex-col items-center">
                    <Logo size="md" />
                    <p className="text-text-muted max-w-md mx-auto mb-8 mt-6 italic">
                        {settings.storeSubtitle}
                    </p>
                    <div className="flex gap-6 mb-8">
                        <button onClick={() => setIsTrackingOpen(true)} className="text-xs uppercase tracking-widest font-bold hover:text-primary transition-colors">Seguir mi pedido</button>
                        <a href="#tienda" className="text-xs uppercase tracking-widest font-bold hover:text-primary transition-colors">Términos y condiciones</a>
                        <a
                            href="/admin"
                            className="text-[11px] uppercase tracking-[0.2em] font-black text-primary hover:text-primary/70 transition-all border-l pl-6 ml-2 border-border"
                        >
                            Acceso Administrador
                        </a>
                    </div>
                    <div className="text-xs text-text-muted/60 uppercase tracking-widest pt-8 border-t w-full">
                        &copy; {new Date().getFullYear()} Dos Lidias. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={(id, delta) => {
                    setCartItems(prev => prev.map(item => {
                        if (item.product.id === id) {
                            const newQty = Math.max(0, item.quantity + delta);
                            return { ...item, quantity: newQty };
                        }
                        return item;
                    }).filter(item => item.quantity > 0));
                }}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => {
                    setIsCheckoutOpen(false);
                }}
                total={cartTotal}
                items={cartItems}
                onSuccess={() => setCartItems([])}
            />

            <TrackingModal
                isOpen={isTrackingOpen}
                onClose={() => setIsTrackingOpen(false)}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setAuthModalOpen(false)}
            />
        </div>
    );
}

export default App;
