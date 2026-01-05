import en from '../localization/en';

let globalTranslations: any = en;

export const setGlobalTranslations = (tr: any) => {
  globalTranslations = tr;
};

export const getGlobalTranslations = () => globalTranslations;

export const translate = (key: string): string => {
  if (!key) return key;
  const keys = key.split('.');
  let value: any = globalTranslations;
  for (const k of keys) {
    if (value === null || value === undefined) return key;
    value = value[k];
  }
  return typeof value === 'string' ? value : key;
};
