import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../index';
import {
  platforms,
  platformStats,
  platformSpecials,
  platformDownloads,
  platformPractices,
  platformFaqs,
  platformLinks,
  modules,
  moduleOutcomes,
  modulePrompts,
  moduleSteps,
  moduleRoles,
  moduleMistakes,
  modulePlans,
  platformPlans,
  platformModels,
  platformModelPlans,
} from '../schema';
import { PLANS } from './plans';
import type { PlatformSeed, PlanRefSeed } from './types';
import { claude } from './claude';
import { copilot } from './copilot';
import { gemini } from './gemini';
import { chatgpt } from './chatgpt';
import { seedMasterAccess } from './master';
import { seedDemoAccess } from './demo';

// El orden acá es el orden en que se muestran en la comparativa.
const SEEDS: PlatformSeed[] = [copilot, claude, gemini, chatgpt];

/** Convierte las referencias por clave de plan en filas con el id ya resuelto. */
function planRows(refs: PlanRefSeed[], planIds: Map<string, number>, where: string) {
  return refs.flatMap((ref) => {
    const planId = planIds.get(ref.plan);
    if (!planId) {
      console.warn(`  ojo: ${where} apunta al plan "${ref.plan}", que no existe`);
      return [];
    }
    return [{ planId, availability: ref.availability ?? ('incluido' as const), note: ref.note }];
  });
}

async function seedPlatform(seed: PlatformSeed, sortOrder: number) {
  const planData = PLANS[seed.id];
  const row = {
    id: seed.id,
    name: seed.name,
    portalName: seed.portalName,
    initial: seed.initial,
    color: seed.color,
    description: seed.description,
    tagline: seed.tagline,
    inputHint: seed.inputHint,
    badge: seed.badge,
    heroTitle: seed.heroTitle,
    heroText: seed.heroText,
    specialTitle: seed.specialTitle,
    specialIntro: seed.specialIntro,
    helpTitle: seed.helpTitle,
    helpText: seed.helpText,
    plansNote: planData?.note,
    status: seed.status,
    sortOrder,
    updatedAt: new Date(),
  };

  await db
    .insert(platforms)
    .values(row)
    .onConflictDoUpdate({ target: platforms.id, set: row });

  // Las listas hijas se reemplazan completas: es contenido editorial, no histórico.
  await db.delete(platformStats).where(eq(platformStats.platformId, seed.id));
  await db.delete(platformSpecials).where(eq(platformSpecials.platformId, seed.id));
  await db.delete(platformDownloads).where(eq(platformDownloads.platformId, seed.id));
  await db.delete(platformPractices).where(eq(platformPractices.platformId, seed.id));
  await db.delete(platformFaqs).where(eq(platformFaqs.platformId, seed.id));
  await db.delete(platformLinks).where(eq(platformLinks.platformId, seed.id));

  if (seed.stats?.length) {
    await db.insert(platformStats).values(
      seed.stats.map((s, i) => ({ platformId: seed.id, ...s, sortOrder: i })),
    );
  }
  if (seed.specials?.length) {
    await db.insert(platformSpecials).values(
      seed.specials.map((s, i) => ({ platformId: seed.id, ...s, sortOrder: i })),
    );
  }
  if (seed.downloads?.length) {
    await db.insert(platformDownloads).values(
      seed.downloads.map((d, i) => ({ platformId: seed.id, ...d, sortOrder: i })),
    );
  }
  if (seed.practices?.length) {
    await db.insert(platformPractices).values(
      seed.practices.map((p, i) => ({ platformId: seed.id, ...p, sortOrder: i })),
    );
  }
  if (seed.faqs?.length) {
    await db.insert(platformFaqs).values(
      seed.faqs.map((f, i) => ({ platformId: seed.id, ...f, sortOrder: i })),
    );
  }
  if (seed.links?.length) {
    await db.insert(platformLinks).values(
      seed.links.map((l, i) => ({ platformId: seed.id, ...l, sortOrder: i })),
    );
  }

  // Planes y modelos: se rehacen enteros, igual que el resto del contenido.
  // Primero caen las tablas puente, porque no se puede confiar en que las
  // claves foráneas estén activas en la conexión de SQLite.
  const planIds = new Map<string, number>();

  if (planData) {
    const oldModels = await db
      .select({ id: platformModels.id })
      .from(platformModels)
      .where(eq(platformModels.platformId, seed.id));
    for (const m of oldModels) {
      await db.delete(platformModelPlans).where(eq(platformModelPlans.modelId, m.id));
    }

    const oldPlans = await db
      .select({ id: platformPlans.id })
      .from(platformPlans)
      .where(eq(platformPlans.platformId, seed.id));
    for (const p of oldPlans) {
      await db.delete(modulePlans).where(eq(modulePlans.planId, p.id));
    }

    await db.delete(platformModels).where(eq(platformModels.platformId, seed.id));
    await db.delete(platformPlans).where(eq(platformPlans.platformId, seed.id));

    for (const [i, plan] of planData.plans.entries()) {
      const [saved] = await db
        .insert(platformPlans)
        .values({ platformId: seed.id, ...plan, sortOrder: i })
        .returning({ id: platformPlans.id });
      planIds.set(plan.key, saved.id);
    }

    for (const [i, model] of planData.models.entries()) {
      const [saved] = await db
        .insert(platformModels)
        .values({
          platformId: seed.id,
          key: model.key,
          name: model.name,
          description: model.description,
          sortOrder: i,
        })
        .returning({ id: platformModels.id });

      const rows = planRows(model.plans, planIds, `${seed.id}/modelo ${model.key}`).map((r) => ({
        modelId: saved.id,
        ...r,
      }));
      if (rows.length) await db.insert(platformModelPlans).values(rows);
    }
  }

  for (const [i, m] of seed.modules.entries()) {
    const moduleRow = {
      platformId: seed.id,
      slug: m.slug,
      name: m.name,
      shortName: m.shortName,
      abbr: m.abbr,
      color: m.color,
      level: m.level,
      category: m.category,
      summary: m.summary,
      intro: m.intro,
      meta: m.meta,
      baIntro: m.baIntro,
      before: m.before,
      beforeTime: m.beforeTime,
      after: m.after,
      afterTime: m.afterTime,
      mockTitle: m.mockTitle,
      mockPrompt: m.mockPrompt,
      mockReply: m.mockReply,
      mockPanelTitle: m.mockPanelTitle,
      mockPanel: m.mockPanel,
      status: m.status ?? 'publicado',
      sortOrder: i,
      updatedAt: new Date(),
    };

    const [saved] = await db
      .insert(modules)
      .values(moduleRow)
      .onConflictDoUpdate({
        target: [modules.platformId, modules.slug],
        set: moduleRow,
      })
      .returning({ id: modules.id });

    const moduleId = saved.id;

    await db.delete(moduleOutcomes).where(eq(moduleOutcomes.moduleId, moduleId));
    await db.delete(modulePrompts).where(eq(modulePrompts.moduleId, moduleId));
    await db.delete(moduleSteps).where(eq(moduleSteps.moduleId, moduleId));
    await db.delete(moduleRoles).where(eq(moduleRoles.moduleId, moduleId));
    await db.delete(moduleMistakes).where(eq(moduleMistakes.moduleId, moduleId));

    if (m.outcomes?.length) {
      await db.insert(moduleOutcomes).values(
        m.outcomes.map((text, j) => ({ moduleId, text, sortOrder: j })),
      );
    }
    if (m.prompts?.length) {
      await db.insert(modulePrompts).values(
        m.prompts.map((p, j) => ({ moduleId, ...p, sortOrder: j })),
      );
    }
    if (m.steps?.length) {
      await db.insert(moduleSteps).values(
        m.steps.map((s, j) => ({ moduleId, ...s, sortOrder: j })),
      );
    }
    if (m.roles?.length) {
      await db.insert(moduleRoles).values(
        m.roles.map((r, j) => ({ moduleId, ...r, sortOrder: j })),
      );
    }
    if (m.mistakes?.length) {
      await db.insert(moduleMistakes).values(
        m.mistakes.map((x, j) => ({ moduleId, ...x, sortOrder: j })),
      );
    }

    // En qué planes se puede dictar este módulo. Sin filas queda "en todos",
    // que es lo correcto para el contenido que todavía no se revisó.
    await db.delete(modulePlans).where(eq(modulePlans.moduleId, moduleId));
    const refs = planData?.modules[m.slug];
    if (refs?.length) {
      const rows = planRows(refs, planIds, `${seed.id}/${m.slug}`).map((r) => ({
        moduleId,
        ...r,
      }));
      if (rows.length) await db.insert(modulePlans).values(rows);
    }
  }

  // Un slug de plans.ts que ya no existe en el contenido es un dato que quedó
  // colgando: mejor gritarlo acá que descubrirlo con el portal en pantalla.
  for (const slug of Object.keys(planData?.modules ?? {})) {
    if (!seed.modules.some((m) => m.slug === slug)) {
      console.warn(`  ojo: plans.ts define "${seed.id}/${slug}", que ya no es un módulo`);
    }
  }

  const prompts = seed.modules.reduce((n, m) => n + (m.prompts?.length ?? 0), 0);
  const plans = planData?.plans.length ?? 0;
  const models = planData?.models.length ?? 0;
  console.log(
    `  ${seed.name.padEnd(20)} ${String(seed.modules.length).padStart(2)} módulos · ${String(prompts).padStart(2)} prompts · ${String(plans).padStart(2)} planes · ${String(models).padStart(2)} modelos · ${seed.status}`,
  );
}

async function main() {
  console.log('Cargando contenido...');
  for (const [i, seed] of SEEDS.entries()) {
    await seedPlatform(seed, i);
  }
  const master = await seedMasterAccess();
  console.log(`  código maestro ${master.code} listo`);
  const demo = await seedDemoAccess();
  console.log(`  código demo ${demo.code} listo`);
  console.log('Listo.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
