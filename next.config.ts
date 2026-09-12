import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El material descargable se lee del disco en tiempo de ejecución con una
  // ruta que se arma con el parámetro, así que el trazado automático no lo ve.
  // Sin esto los archivos no viajan al bundle y la descarga da 404 en Vercel.
  outputFileTracingIncludes: {
    '/api/materiales/[platform]/[file]': ['./private/materiales/**/*'],
    // El panel de materiales lista esa misma carpeta para saber de qué
    // documentos hay genérico y de cuáles no hay nada que descargar.
    '/admin/materiales/[id]': ['./private/materiales/**/*'],
  },

  // `@libsql` publica su binario nativo en seis paquetes de plataforma y npm
  // los instala todos. El trazador de Next no puede saber cuál se resolverá en
  // ejecución, así que se lleva las que encuentra: 29 de las 36 funciones
  // salían con la variante glibc Y la musl dentro, 9.4 MB de las cuales no se
  // ejecutan nunca porque Vercel corre sobre glibc x64.
  //
  // No es peso que se pague una vez. Functions Storage guarda una copia por
  // cada deployment retenido, y este proyecto despliega unas 70 veces al mes.
  //
  // Se deja SOLO `linux-x64-gnu`, que es la que Vercel usa. Esto afecta
  // únicamente al trazado del build: `npm run dev` sigue resolviendo el binario
  // que toque en la máquina de cada quien. Si algún día esto se despliega en un
  // runtime que no sea glibc x64, hay que revisar esta lista.
  // El middleware se traza aparte y NO respeta estas exclusiones: se probó con
  // una clave `'/middleware'` y siguió saliendo con su copia de musl. Se queda
  // así; son 9 MB en una sola función, frente a los 274 MB que esto quita de
  // las otras 29.
  outputFileTracingExcludes: {
    '*': [
      './node_modules/@libsql/linux-x64-musl/**',
      './node_modules/@libsql/linux-arm64-gnu/**',
      './node_modules/@libsql/linux-arm64-musl/**',
      './node_modules/@libsql/linux-arm-gnueabihf/**',
      './node_modules/@libsql/linux-arm-musleabihf/**',
    ],
  },
};

export default nextConfig;
