import { WORKFLOWS } from "./repairWorkflows";

export function buildStepsFromWorkflow(
  issueId: string,
  platform?: string
) {
  const workflow = WORKFLOWS[issueId];

  if (!workflow) return [];

  return workflow.map((step) => ({
    stepId: step.id,
    label: step.label,
    estMinutes: step.estMinutes,
    completed: false,
    completedAt: undefined,
    notes: "",
    photoUrl: "",
  }));
}