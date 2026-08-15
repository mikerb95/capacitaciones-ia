--- El portal deja de pedir datos de contacto: la asistencia se declara con el
--- nombre y nada más. Esto borra los números ya guardados y no tiene vuelta
--- atrás, que es justo lo que se busca.
ALTER TABLE `attendees` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `participants` DROP COLUMN `phone`;