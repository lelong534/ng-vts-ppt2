/**
 * Export types using for pro-layout
 */

import { TemplateRef } from '@angular/core';
import { VtsSizeLMSType } from '@ui-vts/ng-vts/core/types';
import { VtsTheme } from '@ui-vts/theme/services';

export type VtsMenuItemProLayout = {
  title: string;
  children?: VtsMenuItemProLayout[];
  isOpen?: boolean;
  isSelected?: boolean;
  icon?: string;
  id?: string | number;
  url?: string;
};

export type VtsThemeColorType = {
  value: string;
  isChecked: boolean;
  themeValue: VtsTheme
};

export type VtsAvatarUser = {
  name?: string;
  subname?: string;
  imgUrl?: string;
  size: VtsSizeLMSType;
};

export type VtsAvatarMenu = {
  url: string;
  label: string;
};

export type VtsNotificationConfig = {
  type: VtsNotiPaneType;
  overflowCount: number;
};

export type VtsNotiPaneType = 'drawer' | 'menuContext';

export type VtsBlockUIConfig = {
  /**
   * decide if this feature is enabled or disabled
   */
  isEnabled: boolean;
  modalRef?: TemplateRef<void> | null;
  modalLockTitle?: string;
  modalUnlockTitle?: string;
  cancelText?: string;
  locktext?: string;
  unlockText?: string;
};

export type VtsVisibilityConfig = {
  searchIcon: boolean;
  fullScreen: boolean;
  lockScreen: boolean;
  notifyIcon: boolean;
};

export type VtsLayoutState = {
  fixedHeader: boolean,
  fixedSider: boolean,
  splitMenu: boolean,
  showHeader: boolean,
  showSider: boolean,
  showFooter: boolean,
  collapsedSider: boolean
}

export const DEFAULT_LAYOUT_STATE: VtsLayoutState = {
  fixedHeader: false,
  fixedSider: false,
  splitMenu: true,
  showHeader: true,
  showSider: true,
  showFooter: true,
  collapsedSider: false
}

export const LAYOUT_STATE_STORE_KEY = 'layoutState'