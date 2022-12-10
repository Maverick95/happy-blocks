import { FeatureToggle } from 'models/FeatureToggle';

const toggles = (): Record<FeatureToggle, boolean> => ({
  [FeatureToggle.NEXT_TETROMINOS_CENTRE_PIECES] : true,
});

const getFeatureToggle = (toggle: FeatureToggle): boolean => toggles()[toggle];

export default getFeatureToggle;