import React from 'react'
import CustomInputNumber from '../CustomInputNumber/CustomInputNumber'
import { IAllocationRoom, IRoom, TargetName } from '@/types'
import classes from './Room.module.css'
import { numberToChinese } from '@/utils/constant';

interface IRoomProps extends IRoom, IAllocationRoom {
  roomIndex: number;
  unassignedAdult: number;
  unassignedChild: number;
  handleChangeGuest: (roomIndex: number, type: TargetName, value: number) => void
}

const Room: React.FC<IRoomProps> = (props) => {
  const { adult, child, roomIndex, unassignedAdult, unassignedChild, capacity, handleChangeGuest } = props;

  const constraints = {
    [TargetName.adult]: { min: 1, max: Math.min(unassignedAdult + adult, capacity - child) },
    [TargetName.child]: { min: 0, max: Math.min(unassignedChild + child, capacity - adult) },
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = e.target.name as TargetName;
    const { min, max } = constraints[inputName];
    const newValue = Math.max(min, Math.min(max, +e.target.value));
    handleChangeGuest(roomIndex, inputName, newValue);
  }

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log('onBlur', e.target.name, e.target.value);
  }

  return (
    <div className={classes.room}>
      <h4 className={classes.total_guest}>{numberToChinese[capacity]}人房型：{adult + child} 人</h4>
      <div className={classes.guest_type}>
        <div className={classes.guest_title}>
          <p>大人</p>
          <p>年齡 20+</p>
        </div>
        <CustomInputNumber
          step={1}
          name={TargetName.adult}
          min={constraints[TargetName.adult].min}
          max={constraints[TargetName.adult].max}
          value={`${adult}`}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          disabled={false}
        />
      </div>
      <div className={classes.guest_type}>
        <div className={classes.guest_title}>
          <p>小孩</p>
        </div>
        <CustomInputNumber
          step={1}
          name={TargetName.child}
          min={constraints[TargetName.child].min}
          max={constraints[TargetName.child].max}
          value={`${child}`}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          disabled={false}
        />
      </div>
    </div>
  )
}

export default Room