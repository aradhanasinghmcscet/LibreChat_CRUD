import { atomWithLocalStorage } from './utils';

export const statusFilterAtom = atomWithLocalStorage<'all' | 'pending' | 'in-progress' | 'completed'>('todoStatusFilter', 'all');
