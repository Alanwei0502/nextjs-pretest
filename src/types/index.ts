export interface IGuest {
  adult: number;
  child: number;
}

export interface IRoom {
  roomPrice: number;
  adultPrice: number;
  childPrice: number;
  capacity: number;
}

export interface IAllocationRoom {
  adult: number;
  child: number;
  price: number;
}

export type RoomNumber = PropertyKey;

export enum TargetName {
  adult = 'adult',
  child = 'child',
}

export enum InputNumberClickType {
  increase = 'increase',
  decrease = 'decrease',
}
