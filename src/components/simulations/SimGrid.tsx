import React from 'react';
import simulationsData from '@/data/simulations.json';
import SimCard from './SimCard';

export default function SimGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-1">
      {simulationsData.map((sim) => (
        <SimCard key={sim.id} simulation={sim as any} />
      ))}
    </div>
  );
}
