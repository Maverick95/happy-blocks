import { Grid, UpdatePieceResult } from 'classes/Grid';

type TransitionGenerator = (result: UpdatePieceResult, grid: Grid) => (element: HTMLElement) => void

const transitionGeneratorGravityFalls: TransitionGenerator = (result, _) => {
  const delayMsPerX = 50, durationMsPerY = 200;
  const durationMs = Math.floor(durationMsPerY * (result.to.y - result.from.y));
  const delayMs = Math.floor(delayMsPerX * result.from.x);
  const bezierP1X = 0.7 / (result.to.y - result.from.y);
  return (element) => {
    element.style.transition = `top ${durationMs}ms cubic-bezier(${bezierP1X}, 0.0, 1.0, 1.0) ${delayMs}ms`;
  }
};

const transitions: Record<string, TransitionGenerator> = {
  'gravity-falls': transitionGeneratorGravityFalls,
};

export {
  transitions,
  TransitionGenerator,
};