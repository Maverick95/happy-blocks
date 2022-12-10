import { FeatureToggle } from 'models/FeatureToggle';

const toggles = (): Record<FeatureToggle, boolean> => ({
  
});

const getFeatureToggle = (toggle: FeatureToggle): boolean => toggles()[toggle];

export default getFeatureToggle;