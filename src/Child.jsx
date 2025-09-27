import { usePoll } from "lhy-map-hooks";
import React, { useState } from "react";
const Child = () => {
  const [random, setRandom] = useState(Math.floor(Math.random() * 1000));
  const service = async () => {
    Promise.resolve().then(() => {
      setRandom(Math.floor(Math.random() * 1000));
    });
  };
  const [time, setTime] = useState(1000);

  usePoll(service, {
    refreshInterval: time,
  });

  return (
    <div className="dark">
      <button type="button" onClick={() => {
        setTime(undefined);
      }}
      >
        停止
      </button>
      random:{random}
    </div>
  );
};

export default Child;
