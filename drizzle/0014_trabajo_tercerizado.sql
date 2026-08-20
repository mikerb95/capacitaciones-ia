ALTER TABLE `access_codes` ADD `contractor_id` integer REFERENCES companies(id);--> statement-breakpoint
ALTER TABLE `companies` ADD `kind` text DEFAULT 'cliente' NOT NULL;
--- `contractor_id` queda vacío en todo lo que ya existe, y eso es correcto:
--- hasta ahora la única empresa que podía figurar en un PIN era la que recibía
--- la capacitación, así que todo lo viejo es trabajo contratado directo.
---
--- `kind` arranca en 'cliente' por la misma razón: ninguna de las empresas
--- cargadas se usó nunca como intermediaria. La que lo sea se marca a mano.
