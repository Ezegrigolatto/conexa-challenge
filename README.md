# Conexa Challenge

Una webpage construida con Next.js 16 que consume la API de Rick and Morty.

Para este challenge, se ha implementado una página principal que permite a los usuarios seleccionar personajes de dos listas diferentes y ver los episodios en los que aparecen de forma independiente y tambien los episodios en los que ambos personajes aparecen juntos.

La aplicación tiene soporte multi idioma, con deteccion y seteo automatico del mismo en base a la configuración del navegador del usuario. Cuenta ademas con modo oscuro/claro y un diseño responsivo adaptado a diferentes dispositivos en base a media queries.

La integración con la API de Rick and Morty se realiza utilizando TanStack Query para optimizar el rendimiento mediante caching y revalidación de datos. El estado global de la aplicación se maneja con Zustand, proporcionando una gestión sencilla y eficiente del estado. La API utilizada es pública y no requiere autenticación. Se decidió utilizar la version REST de la misma.

El proyecto está desarrollado con TypeScript y utiliza Tailwind CSS para los estilos, junto con Shadcn UI para los componentes de interfaz de usuario. Se ha implementado ademas un sistema de testing utilizando Jest y React Testing Library.

Cuenta con animaciones suaves para mejorar la experiencia del usuario, manejo de errores y estados de carga para una mejor usabilidad. Se ha implementado una página de 404 personalizada para mejorar la experiencia del usuario en caso de rutas no encontradas y una página de error global para manejar errores inesperados en la aplicación.



🔗 **[Ver Demo en Vivo](https://conexa-challenge.vercel.app/)**

## 🚀 Tecnologías

- **Framework:** [Next.js 16](https://nextjs.org/)
- **UI:** [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Estado Global:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query)
- **Internacionalización:** [next-intl](https://next-intl-docs.vercel.app/)
- **Temas:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Componentes UI:** [Shadcn UI](https://shadcn.com/)
- **Animaciones:** [Lottie](https://lottiefiles.com/)
- **Testing:** [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)
- **API:** [Rick and Morty API](https://rickandmortyapi.com/)

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm, yarn o pnpm

## 🛠️ Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/conexa-challenge.git
cd conexa-challenge
```

2. Instala las dependencias:

```bash
npm install
# o
yarn install
# o
pnpm install
```

3. Variables de entorno:
   Crea un archivo `.env.local` en la raíz del proyecto. Para este proyecto se necesita la URL de la API de Rick and Morty.
   En este caso es una API pública por lo que no es estrictamente necesario, pero es una buena práctica.

   NEXT_PUBLIC_API_URL=https://rickandmortyapi.com/api/

4. Inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📜 Scripts Disponibles

| Script                  | Descripción                                |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | Inicia el servidor de desarrollo           |
| `npm run build`         | Genera la build de producción              |
| `npm run start`         | Inicia el servidor de producción           |
| `npm run lint`          | Ejecuta ESLint                             |
| `npm run test`          | Ejecuta los tests                          |
| `npm run test:watch`    | Ejecuta los tests en modo watch            |
| `npm run test:coverage` | Ejecuta los tests con reporte de cobertura |
| `npm run test:ci`       | Ejecuta los tests para CI/CD               |

## 🏗️ Estructura del Proyecto

```
conexa-challenge/
├── app/           # App Router de Next.js
├── components/    # Componentes React (pages, providers, components y layouts)
├── dictionary/    # Archivos de traducción en formato JSON
├── i18n/          # Archivos de internacionalización
├── lib/           # API clients y configuración
├── public/        # Archivos estáticos
├── stores/        # Estado global (Zustand)
└── utils/         # Utilidades y funciones auxiliares
```

## ✨ Características

- 🌐 **Internacionalización** - Soporte multiidioma
- 🌙 **Modo Oscuro/Claro** - Temas personalizables
- 📱 **Diseño Responsivo** - Adaptado a todos los dispositivos
- ⚡ **Rendimiento Optimizado** - Con React Query para caché y revalidación
- 🧪 **Tests** - Cobertura con Jest y Testing Library
- 🎨 **Animaciones** - Transiciones suaves con Motion y Lottie

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar en modo watch
npm run test:watch

# Ver cobertura de código
npm run test:coverage
```

## 🚀 Despliegue

La aplicación está desplegada en [Vercel](https://vercel.com):

**🔗 https://conexa-challenge.vercel.app/**
