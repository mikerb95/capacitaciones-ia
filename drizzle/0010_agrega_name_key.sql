DROP INDEX `attendees_session_participant_idx`;--> statement-breakpoint
ALTER TABLE `attendees` ADD `name_key` text DEFAULT '' NOT NULL;--> statement-breakpoint
DROP INDEX `participants_code_phone_idx`;--> statement-breakpoint
ALTER TABLE `participants` ADD `name_key` text DEFAULT '' NOT NULL;--> statement-breakpoint
--- El nombre normalizado pasa a ser la llave de la persona, así que hay que
--- rellenarlo ANTES de crear los índices únicos: si no, las filas existentes
--- chocarían todas entre sí con la cadena vacía.
--- SQLite no sabe quitar tildes, de ahí la cadena de `replace`. Cubre el
--- español, que es lo que hay: debe dar el mismo resultado que `nameKeyOf` en
--- `src/lib/name.ts`. Los espacios dobles internos no se colapsan aquí; si
--- alguno quedara, esa persona se registra de nuevo la próxima vez que entre.
UPDATE `participants` SET `name_key` = lower(trim(
  replace(replace(replace(replace(replace(replace(replace(
  replace(replace(replace(replace(replace(replace(replace(
    `name`,
    'á','a'),'Á','a'),'é','e'),'É','e'),'í','i'),'Í','i'),'ó','o'),
    'Ó','o'),'ú','u'),'Ú','u'),'ü','u'),'Ü','u'),'ñ','n'),'Ñ','n')
));--> statement-breakpoint
UPDATE `attendees` SET `name_key` = lower(trim(
  replace(replace(replace(replace(replace(replace(replace(
  replace(replace(replace(replace(replace(replace(replace(
    `name`,
    'á','a'),'Á','a'),'é','e'),'É','e'),'í','i'),'Í','i'),'ó','o'),
    'Ó','o'),'ú','u'),'Ú','u'),'ü','u'),'Ü','u'),'ñ','n'),'Ñ','n')
));--> statement-breakpoint
CREATE UNIQUE INDEX `attendees_session_name_idx` ON `attendees` (`session_id`,`name_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `participants_code_name_idx` ON `participants` (`access_code_id`,`name_key`);
