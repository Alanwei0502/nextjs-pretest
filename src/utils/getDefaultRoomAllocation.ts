import { IAllocationRoom, IGuest, IRoom, RoomNumber } from '@/types';

function calculatedPrice(
  adult: IGuest['adult'],
  child: IGuest['child'],
  room: IRoom
) {
  if (adult === 0 && child === 0) return 0;
  return room.roomPrice + adult * room.adultPrice + child * room.childPrice;
}

export function getDefaultRoomAllocation(
  guest: IGuest,
  rooms: IRoom[]
): IAllocationRoom[][] {
  // 1. 找出所有的組合，計算每個房間的可能人數組合價格
  const allAllocationCombination: { [key: RoomNumber]: IAllocationRoom[] } = {};

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    for (let adult = 1; adult <= guest.adult; adult++) {
      for (let child = 0; child <= guest.child; child++) {
        // 如果大人和小孩的總數超過房間的容量，就不考慮
        if (adult + child > room.capacity) break;

        // 如果目前沒有該房間，就新增一個
        if (!allAllocationCombination[i]) {
          allAllocationCombination[i] = [];
        }

        // 計算房間價格
        allAllocationCombination[i].push({
          adult,
          child,
          price: calculatedPrice(adult, child, room),
        });
      }
    }
  }

  // 2. 找出正確人數的房間組合
  let minPrice: number = Infinity;
  const possibleAllocation: { [totalPrice: number]: IAllocationRoom[] }[] = [];

  // 使用遞迴找出最佳組合
  function findBestAllocation(
    currentRoomIndex: number = 0,
    currentAllocation: IAllocationRoom[] = []
  ) {
    if (currentRoomIndex === rooms.length) {
      // 如果已遍歷完最後一個房間，就計算價格
      const [totalAdult, totalChild, totalPrice] = currentAllocation.reduce(
        (acc, cur) => [
          acc[0] + cur.adult,
          acc[1] + cur.child,
          acc[2] + cur.price,
        ],
        [0, 0, 0]
      );
      // 如果大人和小孩的總數不等於原本的人數，就不考慮
      if (totalAdult !== guest.adult || totalChild !== guest.child) return;
      if (totalPrice < minPrice) {
        minPrice = totalPrice;
      }
      possibleAllocation.push({ [totalPrice]: currentAllocation });
      return;
    }

    // 如果還沒找到最後一個房間，就繼續找
    const currentRoomCombinations = allAllocationCombination[currentRoomIndex];
    for (const room of currentRoomCombinations) {
      findBestAllocation(currentRoomIndex + 1, [...currentAllocation, room]);
    }
  }

  findBestAllocation();

  // 3. 找出可能最佳組合
  const result: IAllocationRoom[][] = [];
  possibleAllocation.forEach((a) => {
    if (a.hasOwnProperty(minPrice)) {
      result.push(a[minPrice]);
    }
  });

  console.log({
    allAllocationCombination,
    minPrice,
    possibleAllocation,
    result,
  });

  return result;
}
