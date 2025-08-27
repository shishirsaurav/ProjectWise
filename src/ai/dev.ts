import { config } from 'dotenv';
config();

import '@/ai/flows/assess-project-risks.ts';
import '@/ai/flows/summarize-project-status.ts';
import '@/ai/flows/query-firebase-data.ts';
import '@/ai/tools/project-data-tools.ts';
