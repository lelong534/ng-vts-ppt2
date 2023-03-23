
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  VtsProTableFixedButtons,
} from './pro-table.type';

@Injectable()
export class VtsProTableRenderService {
  labelRender$ = new BehaviorSubject<VtsProTableFixedButtons>(
    {
      new: 'New',
      export: 'Export',
      import: 'Import',
      edit: 'Edit',
      delete: 'Delete',
      enabled: 'Enable / Disable',
      deleteSelected: 'Delete selected',
      clearSelected: 'Clear selected',
      clearSubtext: ' items is selected',
      exportSelected: 'Export selected',
      order: '#',
      actions: 'Action',
      moreActions: 'More actions',
      searchAll: 'Search all ...',
      close: 'Close',
      save: 'Save',
      reset: 'Reset',
      search: 'Search',
      submit: 'Submit',
      rowHeight: {
        normal: 'Normal',
        expand: 'Expand',
        narrow: 'Narrow'
      },
      displayAll: "Display all columns",
      create: 'Create',
      createAnother: 'Create and create another',
      cancel: 'Cancle',
      chooseFile: 'Choose file',
      uploadText: {
        prefix: 'Drag and drop image/video or ',
        subfix: ' for upload',
        permiss: 'Only for datatype: ',
        maxSize: ' and maximum of file volumn is not over '
      }
    }
  )
}