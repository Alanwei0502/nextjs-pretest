'use client'

import React from 'react';
import RoomAllocation from '@/components/RoomAllocation/RoomAllocation';
import { case1, case2, case3, case4 } from '@/data/dummy';
import { IAllocationRoom } from '@/types';
import classes from './page.module.css';

interface IHomeProps { }

const Home: React.FC<IHomeProps> = () => {

  const handleChange = (result: IAllocationRoom[]) => {
    console.log({ result });
  }

  return (
    <main className={classes.container}>
      <RoomAllocation guest={case1.guest} rooms={case1.rooms} onChange={handleChange} />
      <RoomAllocation guest={case2.guest} rooms={case2.rooms} onChange={handleChange} />
      <RoomAllocation guest={case3.guest} rooms={case3.rooms} onChange={handleChange} />
      <RoomAllocation guest={case4.guest} rooms={case4.rooms} onChange={handleChange} />
      <RoomAllocation guest={case3.guest} rooms={case1.rooms} onChange={handleChange} />
      <RoomAllocation guest={case4.guest} rooms={case3.rooms} onChange={handleChange} />
    </main>
  );
};

export default Home;