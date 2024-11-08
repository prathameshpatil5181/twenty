import {
  SingleEntitySelectMenuItems,
  SingleEntitySelectMenuItemsProps,
} from '@/object-record/relation-picker/components/SingleEntitySelectMenuItems';
import { useEntitySelectSearch } from '@/object-record/relation-picker/hooks/useEntitySelectSearch';
import { useRelationPickerEntitiesOptions } from '@/object-record/relation-picker/hooks/useRelationPickerEntitiesOptions';
import { DropdownMenuSearchInput } from '@/ui/layout/dropdown/components/DropdownMenuSearchInput';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { Placement } from '@floating-ui/react';
import { isDefined } from '~/utils/isDefined';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';
import { CreateNewButton } from '@/ui/input/relation-picker/components/CreateNewButton';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { IconPlus } from 'twenty-ui';
export type SingleEntitySelectMenuItemsWithSearchProps = {
  excludedRelationRecordIds?: string[];
  onCreate?: ((searchInput?: string) => void) | (() => void);
  relationObjectNameSingular: string;
  relationPickerScopeId?: string;
  selectedRelationRecordIds: string[];
  dropdownPlacement?: Placement | null;
} & Pick<
  SingleEntitySelectMenuItemsProps,
  | 'EmptyIcon'
  | 'emptyLabel'
  | 'onCancel'
  | 'onEntitySelected'
  | 'selectedEntity'
>;

export const SingleEntitySelectMenuItemsWithSearch = ({
  EmptyIcon,
  emptyLabel,
  excludedRelationRecordIds,
  onCancel,
  onCreate,
  onEntitySelected,
  relationObjectNameSingular,
  relationPickerScopeId = 'relation-picker',
  selectedRelationRecordIds,
  dropdownPlacement,
}: SingleEntitySelectMenuItemsWithSearchProps) => {
  const { handleSearchFilterChange } = useEntitySelectSearch({
    relationPickerScopeId,
  });

  const { entities, relationPickerSearchFilter } =
    useRelationPickerEntitiesOptions({
      relationObjectNameSingular,
      selectedRelationRecordIds,
      excludedRelationRecordIds,
    });

   const createNewButton = isDefined(onCreate) && (
     <CreateNewButton
       onClick={() => onCreate?.(relationPickerSearchFilter)}
       LeftIcon={IconPlus}
       text="Add New"
     />
   );


  let onCreateWithInput = undefined;

  if (isDefined(onCreate)) {
    onCreateWithInput = () => {
      if (onCreate.length > 0) {
        (onCreate as (searchInput?: string) => void)(
          relationPickerSearchFilter,
        );
      } else {
        (onCreate as () => void)();
      }
    };
  }

  const results = (
    <SingleEntitySelectMenuItems
      entitiesToSelect={entities.entitiesToSelect}
      loading={entities.loading}
      selectedEntity={
        entities.selectedEntities.length === 1
          ? entities.selectedEntities[0]
          : undefined
      }
      shouldSelectEmptyOption={selectedRelationRecordIds?.length === 0}
      hotkeyScope={relationPickerScopeId}
      onCreate={onCreateWithInput}
      isFiltered={!!relationPickerSearchFilter}
      {...{
        EmptyIcon,
        emptyLabel,
        onCancel,
        onEntitySelected,
      }}
    />
  );

  return (
    <>
      {dropdownPlacement?.includes('end') && (
        <>
          {results}
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuSearchInput onChange={handleSearchFilterChange} autoFocus />
      {(dropdownPlacement?.includes('start') ||
        isUndefinedOrNull(dropdownPlacement)) && (
        <>
          <DropdownMenuSeparator />
          {results}
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuItemsContainer>{createNewButton}</DropdownMenuItemsContainer>
    </>
  );
};
