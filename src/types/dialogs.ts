import { dialogsComponents } from '../components/dialogs/dialogs'

type DialogsComp = typeof dialogsComponents

export type DialogsType = keyof DialogsComp

export interface Dialogs<T extends DialogsType = 'default'> {
  id: string;
  type?: T;
  props?: any;
}
