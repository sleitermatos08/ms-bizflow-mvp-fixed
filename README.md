# MS BizFlow MVP 0.1

Primera versión funcional y local de MS BizFlow.

## Incluye
- Dashboard con ingresos, gastos, resultado y millas.
- Agregar gastos con categoría, método de pago, porcentaje de uso comercial y opción "sin recibo".
- Agregar ingresos y sales tax cobrado.
- Registro de millaje manual y temporizador de viaje.
- Clientes básicos.
- Recibos/archivos pequeños guardados localmente.
- Resumen de taxes y calendario fiscal básico.
- Exportación CSV.
- Copia de seguridad/restauración JSON.
- Diseño responsive para teléfono y computadora.
- PWA básica para agregar a la pantalla de inicio cuando se sirve desde un servidor web.

## Cómo probarlo
La opción más simple es abrir `index.html` en un navegador moderno. Algunas funciones PWA (service worker/instalar) requieren servir la carpeta con un servidor local.

Con Python instalado:

```bash
cd ms-bizflow-mvp
python -m http.server 8080
```

Luego abre `http://localhost:8080`.

## Importante
Esta versión guarda la información en el navegador del dispositivo mediante `localStorage`. No debe usarse aún como sistema final para datos fiscales sensibles o múltiples clientes.

## Próxima fase recomendada
1. Autenticación de usuarios.
2. Base de datos PostgreSQL/Supabase.
3. Almacenamiento cifrado de recibos.
4. Multiempresa y permisos por cliente.
5. GPS real con registro de ubicación y millaje.
6. Facturas y cuentas por cobrar.
7. Calendario fiscal configurable por estado/entidad.
8. Suscripciones y pagos para vender MS BizFlow a clientes.
9. Auditoría, backups y políticas de privacidad.
10. Pruebas y revisión legal/fiscal antes de ofrecer cálculos o presentación de impuestos.
