import { handleContactSubmission, type AstroAPIContext } from '../../scripts/api-handlers';

export async function POST(context: AstroAPIContext) {
  return handleContactSubmission(context);
}
