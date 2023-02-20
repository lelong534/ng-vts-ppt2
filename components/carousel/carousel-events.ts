import { VtsCarouselEvents } from './lib/types';

export type EventsParams<T = VtsCarouselEvents> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any ? Parameters<T[P]> : never;
};
