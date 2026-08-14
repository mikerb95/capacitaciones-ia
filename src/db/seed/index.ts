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
  }

  const prompts = seed.modules.reduce((n, m) => n + (m.prompts?.length ?? 0), 0);
  console.log(
    `  ${seed.name.padEnd(20)} ${String(seed.modules.length).padStart(2)} módulos · ${String(prompts).padStart(2)} prompts · ${seed.status}`,
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
