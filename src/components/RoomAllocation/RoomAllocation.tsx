'use client';

import React, { useEffect } from 'react';
import { IAllocationRoom, IGuest, IRoom } from '@/types';
import Room from '../Room/Room';
import classes from './RoomAllocation.module.css';
import useAllocations from '@/hooks/useAllocations';

interface IRoomAllocationProps {
  guest: IGuest;
  rooms: IRoom[];
  onChange: (result: IAllocationRoom[]) => void;
}

const RoomAllocation: React.FC<IRoomAllocationProps> = (props) => {
  const { guest, rooms, onChange } = props;

  const { allocations, allocationIndex, allocation, error, unassignedAdult, unassignedChild, totalPrice, handleChangeGuest, handleChooseOption } = useAllocations({ guest, rooms });

  useEffect(() => {
    onChange(allocation);
  }, [onChange, allocation])

  return (
    <div className={classes.room_allocation}>
      <h3 className={classes.total}>住客人數：{guest.adult} 位大人、{guest.child} 位小孩 / {rooms.length} 房</h3>
      {error
        ? <p className={classes.warning}>⚠️ {error}</p>
        : (
          <>
            <p className={classes.unassigned}>尚未分配人數：{unassignedAdult} 位大人、{unassignedChild} 位小孩</p>
            {allocations.length >= 2 && (
              <>
                <p>最佳組合選項：</p>
                <div className={classes.best_allocation_options}>
                  {allocations.map((a, i) => (
                    <div
                      key={`${JSON.stringify(a)}-${i}`}
                      className={`${classes.best_allocation_option} ${allocationIndex === i ? classes.active : ''}`}
                      onClick={() => handleChooseOption(i)}
                    >
                      組合 {i + 1}
                    </div>
                  ))}
                </div>
              </>
            )}
            {allocation?.map((room, i) => (
              <Room key={`${JSON.stringify(room)}-${i}`} handleChangeGuest={handleChangeGuest} roomIndex={i} unassignedAdult={unassignedAdult} unassignedChild={unassignedChild} {...rooms[i]}  {...room} />
            ))}
            <div className={classes.total_price}>
              <h3>總價：{totalPrice} 元</h3>
            </div>
          </>
        )
      }
    </div>
  );
};

export default RoomAllocation;