import React, {FunctionComponent} from 'react';
import {ethers} from "ethers";

type Intput = {
    label: string;
    price: string;
    min: string;
    max: string;
    step: string;
    id: string;
    name: string;
    handleInput: (e: any) => void;
}

const Pricefilter: FunctionComponent<Intput> = (
    {
        label,
        price,
        min,
        max,
        step,
        id,
        name,
        handleInput
    }) => {


    return (

        <div className="mt-2 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-3 ">

                <div className="col-span-3 sm:col-span-2">
                    <label htmlFor="price">{label}</label>
                    <input
                        min={min}
                        max={max}
                        step={step}
                        id={id}
                        name="name"
                        type="range"
                        onInput={handleInput}/>
                </div>
            </div>
            <output> Value: {ethers.utils.formatEther(price)} Eth</output>
        </div>


    );
}

export default Pricefilter;