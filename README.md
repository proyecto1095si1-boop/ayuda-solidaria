# Ayuda Solidaria

Plataforma de crowdfunding solidario para Argentina, similar a GoFundMe.

## Características principales

- **Roles**: Administrador, Solicitante de ayuda, Donante
- **Comisiones configurables** desde el panel admin (plataforma + pasarela)
- Todas las métricas públicas muestran solo el **monto neto** destinado a la causa
- Integración con **Mercado Pago**
- Verificación de identidad (DNI frente/dorso)
- Panel de administración completo
- Auditoría de acciones
- Registro de transferencias a beneficiarios
- Diseño moderno, responsive, mobile-first, modo oscuro

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui |
| Backend | NestJS, Prisma |
| Base de datos | PostgreSQL |
| Almacenamiento | Cloudinary |
| Auth | JWT + OAuth Google |
| Pagos | Mercado Pago |

## Estructura del monorepo

```
ayuda-solidaria/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend NestJS
├── packages/
│   └── shared/       # Tipos y utilidades compartidas
├── docker-compose.yml
└── README.md
```

## Requisitos

- Node.js 20+
- Docker & Docker Compose
- Cuenta de Mercado Pago
- Cuenta de Cloudinary
- Credenciales de Google OAuth

## Inicio rápido

```bash
# Clonar
git clone https://github.com/proyecto1095si1-boop/ayuda-solidaria.git
cd ayuda-solidaria

# Variables de entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Levantar base de datos
docker-compose up -d

# Instalar dependencias
npm install

# Migraciones
cd apps/api && npx prisma migrate dev

# Seed (admin + configuración inicial)
npx prisma db seed

# Desarrollo
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Prisma Studio: `npx prisma studio`

## Comisiones (ejemplo)

| Concepto | Porcentaje |
|----------|------------|
| Comisión plataforma | 12% (configurable) |
| Comisión pasarela | 6.4% (configurable) |
| **Total descontado** | **18.4%** |

Donación bruta: $25.000 → Monto neto a la causa: **$20.400**

Todas las barras de progreso y métricas públicas usan solo el monto neto.

## Roles y permisos

### Administrador
- Dashboard general (totales, campañas, usuarios)
- Aprobar / rechazar / suspender / destacar campañas
- Ver todas las donaciones y comisiones
- Transferir fondos a beneficiarios (con comprobante)
- Exportar reportes (Excel, CSV, PDF)
- Configurar comisiones
- Auditoría completa

### Solicitante
- Registro con DNI + fotos + datos bancarios
- Crear campañas (pendientes de aprobación)
- Ver estado de verificación
- Historial de transferencias recibidas

### Donante
- Donar sin cuenta (opcional nombre/email)
- Ver campañas públicas
- Historial de donaciones (si tiene cuenta)

## Estados de campaña

`Pendiente` → `En revisión` → `Aprobada` / `Rechazada` → `Finalizada` / `Suspendida`

## Licencia

Privado - Uso exclusivo del proyecto.
