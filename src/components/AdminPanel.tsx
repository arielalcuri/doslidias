import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    CreditCard,
    Plus,
    Trash2,
    Edit2,
    X,
    Image as ImageIcon,
    Settings,
    Database,
    Check,
    Layout,
    Truck,
    Coffee,
    Save,
    Search,
    Clock,
    Box,
    ExternalLink,
    Eye,
    ChevronDown,
    Palette,
    MessageCircle,
    Users,
    History
} from 'lucide-react';
import { useProductStore, Product } from '../store/useProductStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useOrderStore, Order } from '../store/useOrderStore';
import { useAuthStore } from '../store/useAuthStore';
import Logo from './Logo';

const AdminPanel: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
    const { settings, updateSettings } = useSettingsStore();
    const { allUsers } = useAuthStore();
    const { orders, updateOrderStatus, updateTrackingNumber, deleteOrder } = useOrderStore();

    const [activeTab, setActiveTab] = useState<'inventory' | 'payments' | 'settings' | 'orders' | 'customers'>('inventory');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '',
        price: 0,
        category: 'Macetas',
        description: '',
        image: ''
    });

    const [tempSettings, setTempSettings] = useState(settings);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateProduct(editingId, formData);
            setEditingId(null);
        } else {
            addProduct(formData);
        }
        setFormData({ name: '', price: 0, category: 'Macetas', description: '', image: '' });
        setIsAdding(false);
    };

    const handleSaveSettings = () => {
        updateSettings(tempSettings);
        alert('Configuración guardada correctamente');
    };

    const startEdit = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image || ''
        });
        setIsAdding(true);
    };

    const cancelForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', price: 0, category: 'Macetas', description: '', image: '' });
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.customerDNI && o.customerDNI.includes(searchQuery))
    );

    const getStatusStyle = (statusId: string) => {
        const found = settings.shippingStatuses.find(s => s.id === statusId);
        return found ? found.color : 'bg-slate-100 text-slate-400 border-slate-200';
    };

    const getStatusIcon = (statusId: string) => {
        const id = statusId.toLowerCase();
        if (id.includes('pendiente')) return <Clock size={14} />;
        if (id.includes('embalado')) return <Box size={14} />;
        if (id.includes('camino')) return <Truck size={14} />;
        if (id.includes('entregado')) return <Check size={14} />;
        if (id.includes('cancel')) return <X size={14} />;
        return <Package size={14} />;
    };

    return (
        <div className="flex min-h-screen bg-[#F7F9FB] font-sans text-slate-800">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20 shadow-sm">
                <div className="h-24 flex items-center justify-center border-b border-slate-50">
                    <Logo size="md" />
                </div>

                <div className="p-8 pb-4 uppercase text-[10px] font-black text-slate-300 tracking-[0.2em]">
                    Administración
                </div>

                <nav className="flex-1 px-4 flex flex-col gap-1.5">
                    <NavItem
                        active={activeTab === 'inventory'}
                        onClick={() => setActiveTab('inventory')}
                        icon={<Package size={18} />}
                        label="Catálogo"
                    />
                    <NavItem
                        active={activeTab === 'orders'}
                        onClick={() => setActiveTab('orders')}
                        icon={<Truck size={18} />}
                        label="Pedidos"
                    />
                    <NavItem
                        active={activeTab === 'payments'}
                        onClick={() => setActiveTab('payments')}
                        icon={<CreditCard size={18} />}
                        label="Pagos"
                    />
                    <NavItem
                        active={activeTab === 'customers'}
                        onClick={() => setActiveTab('customers')}
                        icon={<Users size={18} />}
                        label="Clientes"
                    />
                    <NavItem
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                        icon={<Settings size={18} />}
                        label="Ajustes"
                    />
                </nav>

                <div className="p-8 mt-auto border-t border-slate-50">
                    <div className="text-center">
                        <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest leading-none">Powered by CORTEX</span>
                    </div>
                </div>
            </aside>

            {/* Main Workspace */}
            <main className="flex-1 ml-64 p-10 md:p-16 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'inventory' && (
                            <motion.div
                                key="inventory"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10 animate-up"
                            >
                                <div className="flex justify-between items-end">
                                    <div className="space-y-3">
                                        <h2 className="text-5xl font-black text-slate-900 display-font leading-none tracking-tight">Piezas y Obras</h2>
                                        <p className="text-slate-400 font-medium text-lg italic">Control de stock, precios y catálogo visual de arte.</p>
                                    </div>
                                    {!isAdding && (
                                        <button onClick={() => setIsAdding(true)} className="btn-primary">
                                            <Plus size={20} /> Agregar Nueva
                                        </button>
                                    )}
                                </div>

                                {isAdding && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="glass-card p-12"
                                    >
                                        <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-8">
                                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-4">
                                                <Database size={24} className="text-primary" />
                                                {editingId ? 'Editando Registro' : 'Nueva Ficha Técnica'}
                                            </h3>
                                            <button onClick={cancelForm} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={28} /></button>
                                        </div>

                                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                            <div className="space-y-8">
                                                <FormGroup label="Identidad de la Maceta">
                                                    <input
                                                        required
                                                        className="admin-input"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Ej: Maceta Nóvum 15cm"
                                                    />
                                                </FormGroup>

                                                <div className="grid grid-cols-2 gap-8">
                                                    <FormGroup label="Precio ($)">
                                                        <input
                                                            required type="number"
                                                            className="admin-input"
                                                            value={formData.price}
                                                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup label="Colección">
                                                        <select
                                                            className="admin-input"
                                                            value={formData.category}
                                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                        >
                                                            <option>Macetas</option>
                                                            <option>Arte</option>
                                                            <option>Combos</option>
                                                        </select>
                                                    </FormGroup>
                                                </div>

                                                <FormGroup label="Relato (Descripción)">
                                                    <textarea
                                                        rows={4}
                                                        className="admin-input resize-none"
                                                        value={formData.description}
                                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                        placeholder="Detalles sobre el diseño, materiales y proceso artesanal..."
                                                    />
                                                </FormGroup>
                                            </div>

                                            <div className="space-y-8">
                                                <FormGroup label="Archivo de Imagen (URL)">
                                                    <input
                                                        required
                                                        className="admin-input text-xs font-mono"
                                                        value={formData.image}
                                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                        placeholder="https://images.unsplash.com/..."
                                                    />
                                                </FormGroup>

                                                <div className="aspect-[4/3] bg-slate-50 rounded-[40px] border border-dashed border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                                                    {formData.image ? (
                                                        <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                                    ) : (
                                                        <div className="text-center opacity-10">
                                                            <ImageIcon size={64} className="mx-auto mb-2" />
                                                            <p className="text-[12px] font-black uppercase tracking-widest">Vista Previa</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="lg:col-span-2 flex justify-end gap-4 pt-10 border-t border-slate-50">
                                                <button type="button" onClick={cancelForm} className="btn-secondary border-none text-slate-400 hover:text-slate-600">Cancelar</button>
                                                <button type="submit" className="btn-primary">
                                                    {editingId ? <Check size={20} /> : <Plus size={20} />}
                                                    {editingId ? 'Guardar Cambios' : 'Confirmar Carga'}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                <div className="glass-card shadow-premium border-none">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Pieza / Diseño</th>
                                                <th>Categoría</th>
                                                <th>Precio Unitario</th>
                                                <th className="text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50/50">
                                            {products.map(product => (
                                                <tr key={product.id} className="group hover:bg-slate-50/30 transition-all">
                                                    <td>
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 rounded-[24px] overflow-hidden shadow-sm bg-slate-100 border border-slate-50">
                                                                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                            </div>
                                                            <div>
                                                                <p className="font-extrabold text-slate-800 text-lg leading-tight">{product.name}</p>
                                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{product.category}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="bg-slate-100/50 border border-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="font-black text-primary text-xl tracking-tight">
                                                        ${product.price.toLocaleString('es-AR')}
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <button
                                                                onClick={() => startEdit(product)}
                                                                className="p-3.5 bg-slate-50/80 text-slate-300 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all"
                                                                title="Editar"
                                                            >
                                                                <Edit2 size={20} />
                                                            </button>
                                                            <button
                                                                onClick={() => { if (confirm('¿Eliminar esta pieza permanentemente?')) deleteProduct(product.id) }}
                                                                className="p-3.5 bg-slate-50/80 text-slate-300 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'orders' && (
                            <motion.div
                                key="orders"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10 animate-up"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                                    <div className="space-y-3">
                                        <h2 className="text-5xl font-black text-slate-900 display-font leading-none tracking-tight">Gestión de Envíos</h2>
                                        <p className="text-slate-400 font-medium text-lg italic">Seguimiento de pedidos estilo Correo Argentino.</p>
                                    </div>
                                    <div className="relative w-full md:w-[450px]">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                                            <Search size={22} />
                                        </div>
                                        <input
                                            placeholder="Buscar pedido, cliente, DNI..."
                                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[32px] outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all text-base font-bold shadow-premium placeholder:text-slate-200"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="glass-card shadow-premium border-none overflow-visible">
                                    <table className="admin-table">
                                        <thead>
                                            <tr className="bg-slate-50/30">
                                                <th>Orden / Cliente</th>
                                                <th className="text-center">Estado de Envío</th>
                                                <th className="text-center">Nro Seguimiento</th>
                                                <th className="text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50/50 relative">
                                            {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                                <tr key={order.id} className="group hover:bg-white transition-all duration-300">
                                                    <td className="relative">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-3">
                                                                <p className="font-black text-slate-900 text-xl tracking-tight">{order.id}</p>
                                                                <span className="text-[10px] font-black text-slate-200">|</span>
                                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(order.date).toLocaleDateString('es-AR')}</p>
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-500">{order.customerName}</p>
                                                            {order.customerDNI && <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.2em] mt-1">DNI {order.customerDNI}</p>}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col items-center gap-2 min-w-[240px] relative">
                                                            <div className={`w-full relative px-6 py-3.5 rounded-[20px] border flex items-center justify-between gap-4 transition-all duration-500 shadow-sm ${getStatusStyle(order.status)} group-dropdown hover:scale-[1.03]`}>
                                                                <div className="flex items-center gap-3">
                                                                    {getStatusIcon(order.status)}
                                                                    <span className="font-black text-[11px] uppercase tracking-[0.2em] leading-none">
                                                                        {settings.shippingStatuses.find(s => s.id === order.status)?.label || order.status}
                                                                    </span>
                                                                </div>
                                                                <ChevronDown size={14} className="opacity-30" />

                                                                <select
                                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                    value={order.status}
                                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                                >
                                                                    {settings.shippingStatuses.map(s => (
                                                                        <option key={s.id} value={s.id}>{s.label}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Pulse para cambiar</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center justify-center gap-4">
                                                            <input
                                                                className="w-48 bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-3.5 text-xs font-mono font-black text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-center tracking-[0.2em] placeholder:text-slate-200"
                                                                value={order.trackingNumber || ''}
                                                                placeholder="PENDIENTE"
                                                                onChange={(e) => updateTrackingNumber(order.id, e.target.value)}
                                                            />
                                                            {order.trackingNumber && (
                                                                <a
                                                                    href={`https://www.correoargentino.com.ar/formularios/e-commerce?nro_seguimiento=${order.trackingNumber}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="p-3.5 bg-primary/10 text-primary rounded-[20px] hover:bg-primary hover:text-white transition-all shadow-sm scale-90 hover:scale-100"
                                                                    title="Rastrear"
                                                                >
                                                                    <ExternalLink size={20} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <button
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="p-4 bg-slate-50/80 text-slate-300 rounded-[24px] hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-90"
                                                                title="Expediente Completo"
                                                            >
                                                                <Eye size={22} />
                                                            </button>
                                                            <button
                                                                onClick={() => { if (confirm('¿Eliminar registro?')) deleteOrder(order.id) }}
                                                                className="p-4 bg-slate-50/80 text-slate-300 rounded-[24px] hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                                            >
                                                                <Trash2 size={22} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={4} className="py-32 text-center opacity-20">
                                                        <Search size={80} className="mx-auto mb-6 stroke-1" />
                                                        <p className="text-2xl font-black display-font">No hay coincidencias para "{searchQuery}"</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'payments' && (
                            <motion.div
                                key="payments"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10 animate-up"
                            >
                                <div className="flex justify-between items-end">
                                    <div className="space-y-2">
                                        <h2 className="text-5xl font-black text-slate-900 display-font leading-none tracking-tight">Pasarelas de Cobro</h2>
                                        <p className="text-slate-400 font-medium text-lg italic tracking-tight">Configura cómo cobrar tus ventas artesanales.</p>
                                    </div>
                                    <button onClick={handleSaveSettings} className="btn-primary px-12 h-16">
                                        <Save size={20} /> Guardar Cambios
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="glass-card p-12 flex flex-col gap-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-white border border-slate-50 rounded-[28px] flex items-center justify-center p-4 shadow-sm">
                                                <img src="/MERCADOPAGO.svg" alt="MP" className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-800">Mercado Pago</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${tempSettings.mercadoPagoToken ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                                                    <p className={`text-[11px] ${tempSettings.mercadoPagoToken ? 'text-green-600' : 'text-slate-400'} font-black uppercase tracking-[0.25em]`}>
                                                        {tempSettings.mercadoPagoToken ? 'Motor Activo' : 'Sin Configurar'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <FormGroup label="PROD Access Token">
                                            <input
                                                type="password"
                                                placeholder="APP_USR-..."
                                                className="admin-input font-mono text-sm"
                                                value={tempSettings.mercadoPagoToken}
                                                onChange={e => setTempSettings({ ...tempSettings, mercadoPagoToken: e.target.value })}
                                            />
                                        </FormGroup>
                                        <FormGroup label="Public Key">
                                            <input
                                                type="text"
                                                placeholder="APP_USR-..."
                                                className="admin-input font-mono text-sm"
                                                value={tempSettings.mercadoPagoPublicKey}
                                                onChange={e => setTempSettings({ ...tempSettings, mercadoPagoPublicKey: e.target.value })}
                                            />
                                        </FormGroup>
                                        <FormGroup label="Beneficio: % Descuento">
                                            <div className="relative group/disc">
                                                <input
                                                    type="number"
                                                    className="admin-input font-black text-secondary text-2xl pr-16"
                                                    value={tempSettings.mercadoPagoDiscount}
                                                    onChange={e => setTempSettings({ ...tempSettings, mercadoPagoDiscount: Math.max(0, parseInt(e.target.value) || 0) })}
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-2xl text-slate-200 group-focus-within/disc:text-secondary transition-colors">%</div>
                                            </div>
                                        </FormGroup>
                                        <button
                                            onClick={handleSaveSettings}
                                            className="w-full py-5 bg-[#009EE3] text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:brightness-105 transition-all shadow-xl shadow-[#009EE3]/20"
                                        >
                                            Actualizar Credenciales
                                        </button>
                                    </div>



                                    <div className="glass-card p-12 flex flex-col gap-8 col-span-1 md:col-span-2">
                                        <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white border border-slate-50 rounded-[24px] flex items-center justify-center text-secondary shadow-sm">
                                                    <CreditCard size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-800">Transferencia Bancaria</h3>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Datos para el depósito directo</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleSaveSettings}
                                                className="btn-primary py-4 px-10 text-[10px]"
                                            >
                                                Guardar Datos Bancarios
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <FormGroup label="Entidad (Ej: Banco Galicia)">
                                                <input
                                                    className="admin-input"
                                                    value={tempSettings.bankName}
                                                    onChange={e => setTempSettings({ ...tempSettings, bankName: e.target.value })}
                                                    placeholder="Nombre del banco"
                                                />
                                            </FormGroup>
                                            <FormGroup label="Titular de la Cuenta">
                                                <input
                                                    className="admin-input"
                                                    value={tempSettings.bankHolder}
                                                    onChange={e => setTempSettings({ ...tempSettings, bankHolder: e.target.value })}
                                                    placeholder="Nombre y Apellido"
                                                />
                                            </FormGroup>
                                            <FormGroup label="CBU / CVU">
                                                <input
                                                    className="admin-input font-mono text-sm"
                                                    value={tempSettings.bankCBU}
                                                    onChange={e => setTempSettings({ ...tempSettings, bankCBU: e.target.value })}
                                                    placeholder="000000000000..."
                                                />
                                            </FormGroup>
                                            <FormGroup label="ALIAS">
                                                <input
                                                    className="admin-input font-bold text-primary"
                                                    value={tempSettings.bankAlias}
                                                    onChange={e => setTempSettings({ ...tempSettings, bankAlias: e.target.value })}
                                                    placeholder="MI.ALIAS.PAGO"
                                                />
                                            </FormGroup>
                                            <FormGroup label="Beneficio: % Descuento">
                                                <div className="relative group/disc">
                                                    <input
                                                        type="number"
                                                        className="admin-input font-black text-secondary text-2xl pr-16"
                                                        value={tempSettings.bankDiscount}
                                                        onChange={e => setTempSettings({ ...tempSettings, bankDiscount: Math.max(0, parseInt(e.target.value) || 0) })}
                                                    />
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-2xl text-slate-200 group-focus-within/disc:text-secondary transition-colors">%</div>
                                                </div>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-12 pb-32 animate-up"
                            >
                                <div className="flex justify-between items-end">
                                    <div className="space-y-3">
                                        <h2 className="text-5xl font-black text-slate-900 display-font leading-none tracking-tight">Paramétricas</h2>
                                        <p className="text-slate-400 font-medium text-lg italic">Personaliza el ADN y la operativa de tu negocio.</p>
                                    </div>
                                    <button onClick={handleSaveSettings} className="btn-primary px-12">
                                        <Save size={20} /> Guardar Cambios
                                    </button>
                                </div>

                                {/* LOGISTICS SETTINGS */}
                                <div className="glass-card p-12 space-y-12">
                                    <div className="flex justify-between items-center border-b border-slate-50 pb-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center shadow-inner">
                                                <Truck size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">Etapas de Envío</h3>
                                                <p className="text-sm text-slate-400 font-medium mt-1">Define los estados dinámicos del proceso logístico.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const id = prompt('Identificador Técnico (ej: en_preparacion):');
                                                const label = prompt('Nombre Visible (ej: Pedido Preparado):');
                                                if (id && label) setTempSettings({ ...tempSettings, shippingStatuses: [...tempSettings.shippingStatuses, { id, label, color: 'bg-slate-100 text-slate-400' }] });
                                            }}
                                            className="btn-secondary py-3 text-[10px]"
                                        >
                                            <Plus size={16} /> Agregar Etapa
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {tempSettings.shippingStatuses.map((st, i) => (
                                            <div key={st.id} className="relative group p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 border-dashed hover:border-primary/50 transition-all hover:bg-white">
                                                <button
                                                    onClick={() => setTempSettings({ ...tempSettings, shippingStatuses: tempSettings.shippingStatuses.filter((_, idx) => idx !== i) })}
                                                    className="absolute -top-3 -right-3 w-10 h-10 bg-white text-red-400 rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                                                >
                                                    <X size={20} />
                                                </button>
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center text-slate-200">
                                                            {getStatusIcon(st.id)}
                                                        </div>
                                                        <input
                                                            className="bg-transparent border-none font-black text-slate-800 outline-none w-full uppercase text-xs tracking-[0.2em] focus:text-primary transition-colors"
                                                            value={st.label}
                                                            onChange={e => {
                                                                const s = [...tempSettings.shippingStatuses];
                                                                s[i].label = e.target.value;
                                                                setTempSettings({ ...tempSettings, shippingStatuses: s });
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Palette size={16} className="text-slate-200" />
                                                        <input
                                                            className="w-full text-xs font-mono bg-white px-4 py-3 rounded-2xl border border-slate-50 text-slate-400 outline-none focus:border-primary transition-all"
                                                            value={st.color}
                                                            placeholder="Tailwind classes..."
                                                            onChange={e => {
                                                                const s = [...tempSettings.shippingStatuses];
                                                                s[i].color = e.target.value;
                                                                setTempSettings({ ...tempSettings, shippingStatuses: s });
                                                            }}
                                                        />
                                                    </div>
                                                    <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-center border shadow-sm transition-all ${st.color}`}>
                                                        Vista Previa
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="glass-card p-12 space-y-10">
                                        <h3 className="text-3xl font-black flex items-center gap-5 text-slate-800 display-font border-b border-slate-50 pb-6 leading-none">
                                            <Layout size={32} className="text-primary" /> Visual Branding
                                        </h3>
                                        <div className="space-y-8">
                                            <FormGroup label="Título Principal Hero (Home)">
                                                <input className="admin-input" value={tempSettings.heroTitle} onChange={e => setTempSettings({ ...tempSettings, heroTitle: e.target.value })} />
                                            </FormGroup>
                                            <FormGroup label="Subtítulo / Relato Corto">
                                                <textarea rows={3} className="admin-input resize-none" value={tempSettings.heroSubtitle} onChange={e => setTempSettings({ ...tempSettings, heroSubtitle: e.target.value })} />
                                            </FormGroup>
                                            <FormGroup label="Imágenes Hero (Carousel)">
                                                <div className="space-y-4">
                                                    {tempSettings.heroImages?.map((img, idx) => (
                                                        <div key={idx} className="flex gap-2">
                                                            <input
                                                                className="admin-input font-mono text-xs flex-1"
                                                                value={img}
                                                                placeholder="URL de imagen..."
                                                                onChange={e => {
                                                                    const imgs = [...(tempSettings.heroImages || [])];
                                                                    imgs[idx] = e.target.value;
                                                                    setTempSettings({ ...tempSettings, heroImages: imgs });
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const imgs = (tempSettings.heroImages || []).filter((_, i) => i !== idx);
                                                                    setTempSettings({ ...tempSettings, heroImages: imgs });
                                                                }}
                                                                className="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => setTempSettings({ ...tempSettings, heroImages: [...(tempSettings.heroImages || []), ''] })}
                                                        className="w-full py-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Plus size={16} /> Añadir Imagen al Slider
                                                    </button>
                                                </div>
                                            </FormGroup>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-12">
                                        <div className="glass-card p-12 space-y-10">
                                            <h3 className="text-3xl font-black flex items-center gap-5 text-slate-800 display-font border-b border-slate-50 pb-6 leading-none">
                                                <MessageCircle size={32} className="text-primary" /> Redes & Contacto
                                            </h3>
                                            <div className="space-y-8">
                                                <FormGroup label="WhatsApp Empresarial">
                                                    <input className="admin-input" value={tempSettings.whatsapp} onChange={e => setTempSettings({ ...tempSettings, whatsapp: e.target.value })} />
                                                </FormGroup>
                                                <FormGroup label="Alias Instagram">
                                                    <input className="admin-input" value={tempSettings.instagram} onChange={e => setTempSettings({ ...tempSettings, instagram: e.target.value })} />
                                                </FormGroup>
                                            </div>
                                        </div>

                                        <div className="glass-card p-4 overflow-hidden">
                                            <div className="flex items-center justify-between p-10 bg-slate-50 rounded-[40px] border border-slate-100 group">
                                                <div className="space-y-2">
                                                    <p className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                                        <Coffee size={32} className="text-primary" /> Modo Vacaciones
                                                    </p>
                                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Congela el carrito temporalmente</p>
                                                </div>
                                                <button
                                                    onClick={() => setTempSettings({ ...tempSettings, isVacationMode: !tempSettings.isVacationMode })}
                                                    className={`w-20 h-10 rounded-full transition-all duration-700 relative ${tempSettings.isVacationMode ? 'bg-primary shadow-2xl shadow-primary/40 scale-105' : 'bg-slate-200'}`}
                                                >
                                                    <div className={`absolute top-1.5 w-7 h-7 bg-white rounded-full shadow-2xl transition-all duration-700 transform ${tempSettings.isVacationMode ? 'left-11 shadow-inner' : 'left-1.5'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'customers' && (
                            <motion.div
                                key="customers"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10 animate-up"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                                    <div className="space-y-3">
                                        <h2 className="text-5xl font-black text-slate-900 display-font leading-none tracking-tight">Directorio de Clientes</h2>
                                        <p className="text-slate-400 font-medium text-lg italic">Base de datos de usuarios registrados y su actividad.</p>
                                    </div>
                                    <div className="relative w-full md:w-[450px]">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                                            <Search size={22} />
                                        </div>
                                        <input
                                            placeholder="Buscar por nombre, email, DNI..."
                                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[32px] outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all text-base font-bold shadow-premium placeholder:text-slate-200"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="glass-card shadow-premium border-none">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Cliente</th>
                                                <th>Contacto / DNI</th>
                                                <th>Fecha Nac.</th>
                                                <th className="text-right">Pedidos</th>
                                                <th className="text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50/50">
                                            {allUsers
                                                .filter(u =>
                                                    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    u.docNumber.includes(searchQuery)
                                                )
                                                .map(customer => {
                                                    const customerOrders = orders.filter(o => o.customerEmail === customer.email);
                                                    return (
                                                        <tr key={customer.id} className="group hover:bg-slate-50/20 transition-all">
                                                            <td>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-primary/5 rounded-[16px] flex items-center justify-center text-primary font-black text-xl">
                                                                        {customer.name[0]}{customer.lastName[0]}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-extrabold text-slate-800 text-lg leading-none">{customer.name} {customer.lastName}</p>
                                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">ID: {customer.id}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p className="font-bold text-slate-600 text-sm">{customer.email}</p>
                                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{customer.docType} {customer.docNumber}</p>
                                                            </td>
                                                            <td className="text-slate-400 font-bold text-sm">
                                                                {new Date(customer.birthDate).toLocaleDateString('es-AR')}
                                                            </td>
                                                            <td className="text-right">
                                                                <div className="flex flex-col items-end">
                                                                    <span className="font-black text-slate-800 text-xl tracking-tighter">{customerOrders.length}</span>
                                                                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">Registrados</span>
                                                                </div>
                                                            </td>
                                                            <td className="text-right">
                                                                <button
                                                                    onClick={() => setSelectedCustomer(customer)}
                                                                    className="p-4 bg-slate-50/80 text-slate-300 rounded-[20px] hover:bg-primary/10 hover:text-primary transition-all active:scale-95 flex items-center gap-2 ml-auto"
                                                                >
                                                                    <History size={18} />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">Ver Historial</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* EXPEDIENTE DE PEDIDO (MODAL DETALLES) */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-slate-900/70 backdrop-blur-2xl" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="bg-white w-full max-w-4xl rounded-[32px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden"
                        >
                            <div className="p-8 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-4">
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border shadow-sm w-fit ${getStatusStyle(selectedOrder.status)}`}>
                                            {settings.shippingStatuses.find(s => s.id === selectedOrder.status)?.label || selectedOrder.status}
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 display-font mt-2 leading-none tracking-tighter">Expediente {selectedOrder.id}</h3>
                                        <p className="text-slate-400 font-bold text-xs">{new Date(selectedOrder.date).toLocaleString('es-AR')}</p>
                                    </div>
                                    <button onClick={() => setSelectedOrder(null)} className="p-2 bg-slate-50 text-slate-300 rounded-[16px] hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"><X size={20} /></button>
                                </div>

                                <div className="space-y-6">
                                    {/* DATOS DEL CLIENTE */}
                                    <div className="p-6 bg-slate-50/50 rounded-[24px] border border-slate-100/50 space-y-4 shadow-inner">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-100 pb-2 leading-none">Datos del Cliente</p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Nombre y Apellido</p>
                                                <p className="text-xl font-black text-slate-900 truncate">{selectedOrder.customerName} {selectedOrder.customerLastName}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">E-mail</p>
                                                <p className="text-sm font-bold text-primary truncate">{selectedOrder.customerEmail}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Teléfono</p>
                                                <p className="text-sm font-bold text-slate-600">{selectedOrder.customerPhone || 'S/D'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Documento (DNI)</p>
                                                <p className="text-sm font-bold text-slate-600">{selectedOrder.customerDNI || 'S/D'}</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Domicilio de Entrega</p>
                                                <p className="text-sm font-bold text-slate-600">{selectedOrder.customerAddress || 'S/D'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DATOS DE DESPACHO */}
                                    <div className="p-6 bg-slate-50/50 rounded-[24px] border border-slate-100/50 space-y-4 shadow-inner">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-100 pb-2 leading-none">Datos de Despacho</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-[12px] shadow-lg border border-slate-50 flex items-center justify-center text-primary">
                                                    <Truck size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Operador Logístico</p>
                                                    <p className="text-lg font-black text-slate-900">Correo Argentino</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Nro Seguimiento</p>
                                                <p className="font-mono font-black text-primary text-xl tracking-[0.2em] uppercase">{selectedOrder.trackingNumber || 'PENDIENTE'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TABLA DE PRODUCTOS */}
                                    <div className="glass-card border-slate-100 rounded-[24px] shadow-premium overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-[#FBFCFD]">
                                                <tr>
                                                    <th className="px-6 py-3 font-black uppercase text-[9px] text-slate-300 tracking-[0.3em] text-center">Cant.</th>
                                                    <th className="px-6 py-3 font-black uppercase text-[9px] text-slate-300 tracking-[0.3em]">Pieza Artística</th>
                                                    <th className="px-6 py-3 font-black uppercase text-[9px] text-slate-300 tracking-[0.3em] text-right">Precio</th>
                                                    <th className="px-6 py-3 font-black uppercase text-[9px] text-slate-300 tracking-[0.3em] text-right">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50/50">
                                                {selectedOrder.items.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/20 transition-all">
                                                        <td className="px-6 py-3 font-black text-slate-300 text-center text-base tracking-tighter">{item.quantity}</td>
                                                        <td className="px-6 py-7 font-black text-slate-800 text-sm uppercase tracking-tight">{item.productName}</td>
                                                        <td className="px-6 py-3 text-right text-slate-400 font-bold text-[10px]">${item.price.toLocaleString('es-AR')}</td>
                                                        <td className="px-6 py-3 text-right font-black text-slate-900 text-base tracking-tight">${(item.price * item.quantity).toLocaleString('es-AR')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-primary/[0.03]">
                                                    <td colSpan={3} className="px-8 py-4 text-right font-black text-[9px] uppercase tracking-[0.4em] text-slate-400">Total Facturado</td>
                                                    <td className="px-8 py-4 text-right font-black text-primary text-2xl tracking-tighter">${selectedOrder.total.toLocaleString('es-AR')}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    {/* BOTONES ACCION */}
                                    <div className="flex justify-end gap-4 pt-4 print:hidden">
                                        <button
                                            onClick={() => window.print()}
                                            className="h-12 px-6 border-2 border-slate-100 rounded-[16px] font-black text-slate-400 uppercase text-[9px] tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Save size={16} /> Imprimir
                                        </button>
                                        <button onClick={() => setSelectedOrder(null)} className="h-12 px-8 btn-primary uppercase text-[9px] tracking-widest">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL HISTORIAL DE CLIENTE */}
            <AnimatePresence>
                {selectedCustomer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-slate-900/70 backdrop-blur-2xl" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="bg-white w-full max-w-4xl rounded-[32px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden"
                        >
                            <div className="p-8 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-primary/5 rounded-[32px] flex items-center justify-center text-primary font-black text-4xl shadow-inner">
                                            {selectedCustomer.name[0]}{selectedCustomer.lastName[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-4xl font-black text-slate-900 display-font leading-none tracking-tighter">{selectedCustomer.name} {selectedCustomer.lastName}</h3>
                                            <p className="text-slate-400 font-bold text-sm mt-1">{selectedCustomer.email} • {selectedCustomer.phone || 'Sin Teléfono'}</p>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{selectedCustomer.docType} {selectedCustomer.docNumber} • {selectedCustomer.address || 'Sin Domicilio'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedCustomer(null)} className="p-2 bg-slate-50 text-slate-300 rounded-[16px] hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"><X size={20} /></button>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-100 pb-3 leading-none">Historial de Compras</p>

                                    <div className="glass-card border-slate-100 rounded-[24px] shadow-premium overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-[#FBFCFD]">
                                                <tr>
                                                    <th className="px-6 py-4 font-black uppercase text-[9px] text-slate-300 tracking-[0.3em]">Nro Pedido</th>
                                                    <th className="px-6 py-4 font-black uppercase text-[9px] text-slate-300 tracking-[0.3em]">Fecha</th>
                                                    <th className="px-6 py-4 font-black uppercase text-[9px] text-slate-300 tracking-[0.3em]">Estado</th>
                                                    <th className="px-6 py-4 font-black uppercase text-[9px] text-slate-300 tracking-[0.3em] text-right">Total</th>
                                                    <th className="px-6 py-4 font-black uppercase text-[9px] text-slate-300 tracking-[0.3em] text-right">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50/50">
                                                {orders.filter(o => o.customerEmail === selectedCustomer.email).length > 0 ? (
                                                    orders
                                                        .filter(o => o.customerEmail === selectedCustomer.email)
                                                        .map((order, idx) => (
                                                            <tr key={idx} className="hover:bg-slate-50/20 transition-all">
                                                                <td className="px-6 py-4 font-black text-slate-800 text-base tracking-tighter">{order.id}</td>
                                                                <td className="px-6 py-4 text-slate-400 font-bold text-xs">{new Date(order.date).toLocaleDateString('es-AR')}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                                                        {settings.shippingStatuses.find(s => s.id === order.status)?.label || order.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-right font-black text-slate-900 text-base tracking-tight">${order.total.toLocaleString('es-AR')}</td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedOrder(order);
                                                                        }}
                                                                        className="p-2.5 bg-slate-50 text-slate-300 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                                                    >
                                                                        <Eye size={16} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className="py-12 text-center text-slate-300 italic text-sm">Este cliente aún no ha realizado pedidos.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <button
                                        onClick={() => setSelectedCustomer(null)}
                                        className="w-full mt-6 py-4 bg-slate-900 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all"
                                    >
                                        Volver al Listado
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FormGroup: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col gap-4">
        <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 leading-none">{label}</label>
        {children}
    </div>
);

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`admin-sidebar-item ${active ? 'active' : 'inactive'}`}
    >
        {icon}
        <span className="tracking-tight">{label}</span>
    </button>
);

export default AdminPanel;
