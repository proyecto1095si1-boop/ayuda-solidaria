# Arquitectura - Ayuda Solidaria

## Visión general

Monorepo con dos aplicaciones principales:

```
apps/
  api/     → NestJS + Prisma + PostgreSQL
  web/     → Next.js 14 (App Router) + Tailwind
```

## Flujos principales

### 1. Registro de beneficiario
1. Usuario se registra con rol BENEFICIARY
2. Completa DNI, fotos DNI, datos bancarios (CBU/Alias)
3. Solo admin ve CBU/Alias/DNI fotos

### 2. Creación de campaña
1. Beneficiario crea campaña → estado PENDING
2. Sube fotos, videos, comprobantes
3. Admin revisa → APPROVED / REJECTED / SUSPENDED
4. Si APPROVED → aparece en listado público

### 3. Donación
1. Donante (con o sin cuenta) elige monto
2. Se calcula:
   - Comisión plataforma (configurable, default 12%)
   - Comisión procesador (configurable, default 6.4%)
   - Neto = bruto - plataforma - procesador
3. Se crea preferencia Mercado Pago
4. Webhook confirma pago → se actualiza netRaised de la campaña
5. **Todas las métricas públicas muestran solo el neto**

### 4. Transferencia a beneficiario
1. Admin ve donaciones netas disponibles
2. Registra transferencia con monto, nro de operación y comprobante
3. Queda registrado en Transfer + AuditLog

## Modelos principales

- User (roles: ADMIN | BENEFICIARY | DONOR)
- Campaign (estados: PENDING → UNDER_REVIEW → APPROVED/REJECTED → FINISHED/SUSPENDED)
- Donation (gross, platformFee, processorFee, net)
- Transfer
- PlatformSettings (comisiones)
- AuditLog

## Seguridad

- JWT + Google OAuth
- RolesGuard en endpoints admin
- Datos bancarios y DNI solo para ADMIN
- Helmet, CORS, ValidationPipe
- Auditoría de acciones críticas

## Próximos pasos recomendados

1. Completar webhook real de Mercado Pago
2. Exportación Excel/CSV/PDF de reportes
3. Panel de verificación de documentos (admin)
4. Notificaciones por email
5. Tests e2e
6. Deploy (Vercel + Railway/Render + Cloudinary)
