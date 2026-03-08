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
import { useGalleryStore } from './store/useGalleryStore';
import { useStatsStore } from './store/useStatsStore';
import { MessageCircle, Truck, ShieldCheck, Palette, MapPin, Search, SlidersHorizontal, ArrowUpDown, X as XIcon, Users } from 'lucide-react';

function App() {
    const { products, fetchProducts } = useProductStore();
    const { settings, fetchSettings } = useSettingsStore();
    const { fetchGallery } = useGalleryStore();
    const { isAuthModalOpen, setAuthModalOpen, checkUser } = useAuthStore();
    const { trackVisit } = useStatsStore();
    const [cartItems, setCartItems] = useState<{ product: any; quantity: number }[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSize, setSelectedSize] = useState('Todos');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedTheme, setSelectedTheme] = useState('Todos');
    const [selectedSubtheme, setSelectedSubtheme] = useState('Todos');
    const [priceOrder, setPriceOrder] = useState<'default' | 'asc' | 'desc'>('default');

    useEffect(() => {
        checkUser();
        fetchSettings();
        fetchProducts();
        fetchGallery();

        // Track visit
        const isAdmin = window.location.pathname === '/admin';
        trackVisit(window.location.pathname, isAdmin);
    }, []);

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
            const existing = prev.find(item => item.product.name === product.name);
            if (existing) {
                return prev.map(item =>
                    item.product.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
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
                    <div className="flex flex-col gap-4">
                        <h2 className="text-5xl md:text-7xl text-text-main">La Tienda</h2>
                        <p className="text-text-muted text-lg italic">Objetos con alma para tus espacios.</p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-12 bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


                        {/* Theme Filter */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tema</label>
                            <div className="relative">
                                <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <select
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer"
                                    value={selectedTheme}
                                    onChange={(e) => {
                                        setSelectedTheme(e.target.value);
                                        setSelectedSubtheme('Todos'); // Reset subtheme when theme changes
                                    }}
                                >
                                    <option value="Todos">Todos los temas</option>
                                    {Array.from(new Set(products.map(p => p.theme).filter(Boolean))).map(theme => (
                                        <option key={theme} value={theme}>{theme}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Subtheme Filter */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtema / Artista</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <select
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer"
                                    value={selectedSubtheme}
                                    onChange={(e) => setSelectedSubtheme(e.target.value)}
                                >
                                    <option value="Todos">Todos los subtemas</option>
                                    {Array.from(new Set(products
                                        .filter(p => selectedTheme === 'Todos' || p.theme === selectedTheme)
                                        .map(p => p.subtheme)
                                        .filter(Boolean))
                                    ).map(subtheme => (
                                        <option key={subtheme} value={subtheme}>{subtheme}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tamaño</label>
                            <div className="relative">
                                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <select
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer"
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    <option value="Todos">Todos</option>
                                    {settings.potNumbers?.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price Ordering */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ordenar por Precio</label>
                            <div className="relative">
                                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <select
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer"
                                    value={priceOrder}
                                    onChange={(e) => setPriceOrder(e.target.value as any)}
                                >
                                    <option value="default">Recomendados</option>
                                    <option value="asc">Menor precio</option>
                                    <option value="desc">Mayor precio</option>
                                </select>
                            </div>
                        </div>

                        {/* Category/Collection */}
                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Colección Principal</label>
                            <div className="flex gap-2">
                                {['Todas', 'Macetas', 'Arte', 'Combos'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`flex-1 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search by Identity */}
                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Búsqueda Libre</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="text"
                                    placeholder="Busca por nombre o detalle..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {(searchQuery || selectedSize !== 'Todos' || selectedCategory !== 'Todas' || selectedTheme !== 'Todos' || selectedSubtheme !== 'Todos' || priceOrder !== 'default') && (
                        <div className="mt-6 flex justify-center border-t border-slate-50 pt-6">
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedSize('Todos');
                                    setSelectedCategory('Todas');
                                    setSelectedTheme('Todos');
                                    setSelectedSubtheme('Todos');
                                    setPriceOrder('default');
                                }}
                                className="text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/70 transition-all flex items-center gap-2"
                            >
                                <XIcon size={14} /> Limpiar Filtros
                            </button>
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-16">
                    {(() => {
                        const filtered = products.filter(product => {
                            const matchesName = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (product.subtheme && product.subtheme.toLowerCase().includes(searchQuery.toLowerCase()));
                            const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
                            const matchesTheme = selectedTheme === 'Todos' || product.theme === selectedTheme;
                            const matchesSubtheme = selectedSubtheme === 'Todos' || product.subtheme === selectedSubtheme;
                            const matchesSize = selectedSize === 'Todos' || (product.variants && product.variants.some(v => v.size === selectedSize));
                            return matchesName && matchesCategory && matchesTheme && matchesSubtheme && matchesSize;
                        }).sort((a, b) => {
                            if (priceOrder === 'default') return 0;
                            const priceA = a.variants && a.variants.length > 0 ? Math.min(...a.variants.filter(v => v && typeof v.price === 'number').map(v => v.price)) : (a.price || 0);
                            const priceB = b.variants && b.variants.length > 0 ? Math.min(...b.variants.filter(v => v && typeof v.price === 'number').map(v => v.price)) : (b.price || 0);
                            return priceOrder === 'asc' ? priceA - priceB : priceB - priceA;
                        });

                        if (filtered.length === 0) {
                            return (
                                <div className="col-span-full py-32 text-center opacity-30">
                                    <Search size={64} className="mx-auto mb-6 stroke-1 text-slate-400" />
                                    <h3 className="text-2xl font-black display-font mb-2">No encontramos resultados</h3>
                                    <p className="text-sm font-medium">Prueba ajustando los filtros o la búsqueda.</p>
                                </div>
                            );
                        }

                        return filtered.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                        ));
                    })()}
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
                    <div className="text-xs text-text-muted/60 uppercase tracking-widest pt-8 border-t w-full flex flex-col md:flex-row justify-between items-center gap-4">
                        <span>&copy; {new Date().getFullYear()} Dos Lidias. Todos los derechos reservados.</span>
                        <span className="text-[9px] opacity-30 font-black">STABLE RELEASE v1.0.9 - UX OPTIMIZED</span>
                    </div>
                </div>
            </footer >

            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={(name, delta) => {
                    setCartItems(prev => prev.map(item => {
                        if (item.product.name === name) {
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
        </div >
    );
}

export default App;
