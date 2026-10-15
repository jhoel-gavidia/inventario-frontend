# R&S Jhoelito · Inventario Frontend

Aplicación web para la gestión de inventario de un taller de repuestos. Incluye un panel operativo con KPIs, administración de productos, categorías, movimientos de stock y usuarios, además de un módulo de auditoría con trazabilidad de cambios. Consume una API REST protegida con JWT y control de acceso por roles (ADMIN / USER).

> El backend es un servicio aparte (Spring Boot). En desarrollo se puede levantar localmente; ver [Proyecto relacionado](#proyecto-relacionado).

## Tabla de contenidos

- [Funcionalidades](#funcionalidades)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Ejecución](#ejecución)
- [Scripts disponibles](#scripts-disponibles)
- [Arquitectura](#arquitectura)
- [Rutas principales](#rutas-principales)
- [Roles y permisos](#roles-y-permisos)
- [Notas de seguridad](#notas-de-seguridad)
- [Proyecto relacionado](#proyecto-relacionado)
- [Autor](#autor)

## Funcionalidades

- **Autenticación con cookie HTTP-only**: el token JWT nunca se expone en el cliente. El login maneja el rate-limit (`429`) y las vistas privadas redirigen al login cuando la sesión expira (`401`/`403`).
- **Dashboard operativo**: KPIs (total de productos, stock disponible, entradas y salidas), distribución de productos por categoría, panel de atención (productos sin stock), actividad reciente y accesos rápidos.
- **Productos**: listado con búsqueda y filtro por categoría, paginación, creación y edición en un panel lateral (drawer) con cálculo de margen y alerta de margen negativo.
- **Categorías**: CRUD completo, búsqueda, estadísticas y exportación a CSV.
- **Movimientos**: registro de entradas y salidas con múltiples detalles, historial filtrable por tipo y búsqueda, y métricas del día (entradas, salidas, balance).
- **Usuarios** *(solo ADMIN)*: CRUD de usuarios, asignación de roles y resumen por rol.
- **Auditoría** *(solo ADMIN)*: listado paginado de cambios, filtros (búsqueda, entidad, acción, fecha), inspector de diferencias antes/después y exportación a CSV.
- **Páginas propias** de error y de 404.
- **Design system** centralizado en tokens de Tailwind (`globals.css`), con modo claro y paleta semántica (primary, surface, success, error, warning, etc.).

## Stack tecnológico

| Categoría | Tecnologías |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI / Lenguaje | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com/) |
| Estado / Datos | [TanStack Query 5](https://tanstack.com/query), [axios](https://axios-http.com/) |
| Iconografía | [lucide-react](https://lucide.dev/) |
| Backend consumido | API REST externa (Spring Boot) |
| Calidad de código | ESLint |

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Acceso a una instancia de la [API de inventario](#proyecto-relacionado) (local o desplegada)

## Instalación

1. Clona el repositorio y entra en la carpeta del proyecto:

   ```bash
   git clone https://github.com/jhoel-gavidia/inventario-frontend.git
   cd inventario-frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env.local` en la raíz del proyecto (ver [Variables de entorno](#variables-de-entorno)).

## Variables de entorno

Crea un archivo `.env.local` en la raíz:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

- Debe contener la URL base de la API **incluyendo** el prefijo `/api/v1` y **sin** barra `/` al final.
- En desarrollo, si la variable no está definida, el cliente cae por defecto a `http://localhost:8080/api/v1`.
- En producción, defínela en la configuración privada del proveedor de despliegue (no la subas al repositorio).

## Ejecución

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La raíz redirige a `/auth/login`, que es el punto de entrada de la aplicación.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia Next.js en modo desarrollo. |
| `npm run build` | Genera el build optimizado de producción. |
| `npm run start` | Sirve el build de producción. |
| `npm run lint` | Ejecuta ESLint sobre el proyecto. |

## Arquitectura

El proyecto sigue una organización **feature-based**: cada dominio agrupa sus componentes, hooks, servicios y tipos.

```text
app/
├── (protected)/          # Área privada: layout con sidebar/header y guard de sesión
│   ├── dashboard/        # Panel de resumen
│   ├── productos/        # Gestión de productos
│   ├── categorias/       # Gestión de categorías
│   ├── movimientos/      # Entradas y salidas de stock
│   ├── usuarios/         # Gestión de usuarios (ADMIN)
│   └── auditorias/       # Auditoría de cambios (ADMIN)
├── auth/login/           # Inicio de sesión
├── providers.tsx         # QueryClientProvider de TanStack Query
├── error.tsx             # Error boundary de la aplicación
├── global-error.tsx      # Error boundary global
└── not-found.tsx         # Página 404

features/
├── auth/                 # Login/logout, caché de sesión y hooks de auth
├── dashboard/            # KPIs y resumen del inventario
├── products/             # Productos: tabla, drawer, filtros y modal de movimientos
├── categories/           # Categorías
├── movements/            # Movimientos
├── users/                # Usuarios
└── audit/                # Auditoría

lib/
└── api/                  # Cliente axios, manejo de errores y helper de paginación
```

Cada feature expone, según necesita, subcarpetas `components/`, `hooks/`, `services/`, `types/` y `utils/`.

Las páginas no llaman directamente a la API externa desde cualquier punto: la comunicación se centraliza en `features/*/services/` sobre el cliente `lib/api/axios.ts`, que añade `withCredentials` (para la cookie de sesión) y redirige globalmente al login ante un `401`/`403`.

### Respuestas paginadas

Los endpoints de movimientos y auditorías devuelven `PaginaResponse<T>`:

```json
{
  "contenido": [],
  "pagina": 0,
  "tamano": 20,
  "totalElementos": 0,
  "totalPaginas": 0,
  "primera": true,
  "ultima": true
}
```

El helper `getAllPages` (`lib/api/paginated.ts`) recorre todas las páginas y devuelve la lista plana (`contenido`), de modo que los hooks y las vistas trabajan con arrays.

## Rutas principales

| Ruta | Propósito | Acceso |
|---|---|---|
| `/auth/login` | Inicio de sesión. | Público |
| `/dashboard` | Resumen, KPIs y actividad reciente. | USER / ADMIN |
| `/productos` | Consulta y administración de productos. | USER / ADMIN |
| `/categorias` | Consulta y administración de categorías. | USER / ADMIN |
| `/movimientos` | Registro e historial de entradas y salidas. | USER / ADMIN |
| `/usuarios` | Gestión de usuarios. | ADMIN |
| `/auditorias` | Registro de auditoría e inspector de cambios. | ADMIN |

## Roles y permisos

- **USER**: consulta productos y categorías, y registra movimientos de stock.
- **ADMIN**: acceso completo, incluida la gestión de usuarios y el módulo de auditoría.

Las rutas privadas están protegidas en dos niveles: el layout de `(protected)` valida la sesión y restringe las rutas de administración, y el backend aplica las mismas reglas por rol.

## Notas de seguridad

- El token JWT se almacena exclusivamente en una **cookie HTTP-only**, inaccesible desde JavaScript del cliente, reduciendo el riesgo de robo de sesión vía XSS.
- `next.config.ts` aplica **Content-Security-Policy** (con `connect-src` restringido al origen de la API) y cabeceras `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`. También desactiva `poweredByHeader`.
- El archivo `.env.local` y cualquier credencial están excluidos del control de versiones.
- La cookie de sesión se emite con `Secure` y `SameSite=None`, por lo que la API **debe servirse por HTTPS en producción**.

## Proyecto relacionado

Este frontend consume la API REST [**inventario-api**](https://github.com/jhoel-gavidia/inventario-api), construida con Java 21, Spring Boot, Spring Security (JWT) y PostgreSQL, con migraciones Flyway, pruebas de integración y despliegue mediante Docker.

## Autor

**Jhoel Anderson Gavidia Calderón**
[GitHub](https://github.com/jhoel-gavidia) · [LinkedIn](https://linkedin.com/in/jhoel-anderson-gavidiacalderon-99a688401)
