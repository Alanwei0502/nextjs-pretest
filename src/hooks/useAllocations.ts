'use client';

import { useState, useEffect } from 'react';
import { getDefaultRoomAllocation } from '@/utils/getDefaultRoomAllocation';
import { IAllocationRoom, IGuest, IRoom, TargetName } from '@/types';

const useAllocations = ({
  guest,
  rooms,
}: {
  guest: IGuest;
  rooms: IRoom[];
}) => {
  const [allocations, setAllocations] = useState<IAllocationRoom[][]>([]);
  const [allocationIndex, setAllocationIndex] = useState<number>(0);
  const [allocation, setAllocation] = useState<IAllocationRoom[]>([]);
  const [error, setError] = useState('');

  const unassignedAdult =
    guest.adult - allocation?.reduce((acc, room) => acc + room.adult, 0);
  const unassignedChild =
    guest.child - allocation?.reduce((acc, room) => acc + room.child, 0);
  const totalPrice = allocation?.reduce((acc, room) => acc + room.price, 0);

  useEffect(() => {
    const defaultAllocations = getDefaultRoomAllocation(guest, rooms);
    if (defaultAllocations.length === 0) {
      const totalGuest = guest.adult + guest.child;
      const totalCapacity = rooms.reduce((acc, cur) => acc + cur.capacity, 0);
      if (totalGuest > totalCapacity) {
        setError('住客人數超過房間總容量');
        return;
      }
      if (totalGuest < rooms.length) {
        setError('住客人數最少等於房間數量');
        return;
      }
      if (guest.adult < rooms.length && guest.child > 0) {
        setError('無法分配，有小孩的房間必須有大人');
        return;
      }
    }
    setAllocations(defaultAllocations);
    setAllocation(defaultAllocations[0]);
  }, [guest, rooms]);

  const handleChooseOption = (i: number) => {
    setAllocationIndex(i);
    setAllocation(allocations[i]);
  };

  const handleChangeGuest = (
    roomIndex: number,
    type: TargetName,
    value: number
  ) => {
    setAllocation(
      allocation.map((room, i) => {
        const { adultPrice, childPrice, roomPrice } = rooms[i];
        const newRoom = { ...room, [type]: value };
        newRoom.price =
          newRoom.adult * adultPrice + newRoom.child * childPrice + roomPrice;
        return i === roomIndex ? newRoom : room;
      })
    );
  };

  return {
    allocations,
    allocationIndex,
    allocation,
    error,
    unassignedAdult,
    unassignedChild,
    totalPrice,
    setAllocationIndex,
    setAllocation,
    handleChooseOption,
    handleChangeGuest,
  };
};

export default useAllocations;
