# Dos Lidias - Arte sobre Macetas 🏺✨

**Dos Lidias** es una plataforma de comercio electrónico diseñada para una boutique de arte especializada en macetas intervenidas a mano. El sistema combina una experiencia de usuario fluida y estética con un panel de administración robusto para la gestión total del negocio.

---

## 🚀 Tecnologías Utilizadas

La plataforma está construida con el stack **Vite + React + Supabase**, priorizando la velocidad, escalabilidad y una experiencia visual premium.

### **Frontend (Interfaz de Usuario)**
- **React 18**: Biblioteca principal para la construcción de interfaces.
- **TypeScript**: Para un desarrollo robusto con tipado estático.
- **Tailwind CSS**: Framework de estilos para un diseño moderno y responsive.
- **Framer Motion**: Motor de animaciones para transiciones fluidas y micro-interacciones "boutique".
- **Zustand**: Gestión de estado global ligera y eficiente (Carrito, Autenticación, Ajustes).
- **Lucide React**: Set de iconos elegantes y consistentes.
- **Vite**: Herramienta de compilación ultra rápida.

### **Backend & Infraestructura**
- **Supabase**: 
  - **PostgreSQL Database**: Almacenamiento confiable de productos, pedidos y perfiles.
  - **Auth**: Gestión de usuarios y sesiones segura.
  - **Storage**: Alojamiento de imágenes de alta resolución para la galería.
  - **Edge Functions**: Lógica de servidor para integraciones externas.
- **Vercel**: Plataforma de hosting con CI/CD automático.

---

## 💎 Beneficios del Sistema

1.  **Estética "Boutique Art":** Diseño personalizado con efectos de profundidad (*Glows*), sombras suaves y animaciones artesanales que reflejan la identidad de la marca.
2.  **Velocidad de Carga Extrema:** Gracias al uso de Vite y una arquitectura Single Page Application (SPA), la navegación es instantánea.
3.  **Gestión Centralizada:** Panel de administración unificado para controlar stock, ver métricas en tiempo real y gestionar pedidos.
4.  **Seguridad de Datos:** Integración nativa con Supabase Row Level Security (RLS) para proteger la información de clientes y ventas.
5.  **Optimizado para Móviles:** Experiencia de compra 100% fluida en celulares y tablets.

---

## 🔌 Integraciones & APIs

La plataforma está diseñada para ser el núcleo operativo del negocio, conectándose con los servicios líderes:

- **Mercado Pago API**: Procesamiento de pagos seguro con soporte para tarjetas, transferencias (con descuento automático) y cuotas.
- **WhatsApp Business**: Enlace directo para atención al cliente y coordinación de envíos desde cada producto y pedido.
- **Instagram**: Integración visual y estrategia de catálogo para sincronización de marca.
- **Supabase Realtime**: Actualizaciones instantáneas en el panel de administración cuando ingresa un nuevo pedido.

---

## 🛠️ Instalación y Desarrollo

Si deseas clonar y ejecutar este proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/arielalcuri/doslidias.git
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno:**
    Crea un archivo `.env` con tus credenciales de Supabase:
    ```env
    VITE_SUPABASE_URL=tu_url
    VITE_SUPABASE_ANON_KEY=tu_key
    ```
4.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

---

## 📝 Licencia
Desarrollado para **Dos Lidias - Diseño de Autor**. Todos los derechos reservados.

---
*Hecho con ❤️ para transformar espacios con arte.*
