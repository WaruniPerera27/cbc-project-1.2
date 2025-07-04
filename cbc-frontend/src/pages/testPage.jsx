import { useState } from "react";

export default function TestPage() {
  // state variable for count
  const [count, setCount] = useState(0);

  // increment function
  function incrementCount() {
    setCount(count + 1);
  }

  // decrement function
  function decrementCount() {
    setCount(count - 1);
  }

  return (
    <div className="w-full h-screen bg-teal-300 flex justify-center items-center">
      <div className="w-[500px] h-[500px] bg-amber-50 flex flex-col justify-center items-center">
        <h1 className="text-5xl font-extrabold mb-8">{count}</h1>

        <div className="w-full flex justify-center items-center h-[100px]">
          <button
            onClick={incrementCount}
            className="w-[100px] bg-blue-500 h-[40px] flex justify-center items-center text-amber-50 rounded mx-2"
          >
            +
          </button>

          <button
            onClick={decrementCount}
            className="w-[100px] bg-blue-500 h-[40px] flex justify-center items-center text-amber-50 rounded mx-2"
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}
