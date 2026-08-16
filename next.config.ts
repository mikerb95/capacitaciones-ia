import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El material descargable se lee del disco en tiempo de ejecución con una
  // ruta que se arma con el parámetro, así que el trazado automático no lo ve.
  // Sin esto los archivos no viajan al bundle y la descarga da 404 en Vercel.
  outputFileTracingIncludes: {
    '/api/materiales/[platform]/[file]': ['./private/materiales/**/*'],
  },
};

export default nextConfig;
