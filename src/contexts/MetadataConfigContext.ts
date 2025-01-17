import { createStore } from "zustand";
import { createStoreContext } from "../utils/zustand";

interface MetadataConfigContextProps {
  fieldDisplayNames?: Record<string, string>;
  sortableFields?: string[];
  tooltipFields?: string[];
}

interface MetadataConfigContextActions {
  getFieldDisplayName: (field: string) => string;
  getSortableFields: (fields: string[]) => string[];
  getTooltipFields: (fields: string[]) => string[];
}

interface MetadataConfigContext
  extends MetadataConfigContextProps,
    MetadataConfigContextActions {}

const capitalizeAndReplaceUnderscores = (str: string) =>
  str
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const createMetadataConfigStore = ({
  fieldDisplayNames,
  sortableFields,
  tooltipFields,
}: MetadataConfigContextProps) => {
  return createStore<MetadataConfigContext>()(() => ({
    fieldDisplayNames,
    sortableFields,
    tooltipFields,
    getFieldDisplayName: (field: string) =>
      fieldDisplayNames?.[field] ?? capitalizeAndReplaceUnderscores(field),
    getSortableFields: (fields: string[]) =>
      sortableFields
        ? fields.filter((field) => sortableFields.includes(field))
        : fields,
    getTooltipFields: (fields: string[]) =>
      tooltipFields
        ? fields.filter((field) => tooltipFields.includes(field))
        : fields,
  }));
};

export const [MetadataConfigProvider, useMetadataConfig] = createStoreContext<
  MetadataConfigContext,
  MetadataConfigContextProps,
  false
>(createMetadataConfigStore, "FractionContext", false);

export const useFieldDisplayName = (field: string) =>
  useMetadataConfig().getFieldDisplayName(field);
export const useSortableFields = (fields: string[]) =>
  useMetadataConfig().getSortableFields(fields);
export const useTooltipFields = (fields: string[]) =>
  useMetadataConfig().getTooltipFields(fields);
