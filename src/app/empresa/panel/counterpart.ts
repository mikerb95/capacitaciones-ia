import type { CompanyTraining } from '@/db/queries';

/**
 * De qué lado mira esta empresa la capacitación. La misma fila se lee distinto
 * según quién entre al panel: la capacitadora necesita saber para qué cliente
 * fue, y la empresa que la recibió, quién la contrató. Devuelve `null` en el
 * trato directo, donde no hay nadie más de quien hablar.
 */
export function counterpart(training: CompanyTraining, companyId: number) {
  if (training.contractorId === companyId) {
    return training.company ? `para ${training.company.name}` : null;
  }
  return training.contractor ? `contratada por ${training.contractor.name}` : null;
}
