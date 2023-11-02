// Styles
'use client'

import Flex from "@/UI/layouts/Flex/Flex";
import Asset from "../Asset/Asset";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import LogoEth from "../Icons/LogoEth";
import LabelValue from "../LabelValue/LabelValue";

const TradingControls = () => {
    return (
        <Flex gap='gap-12'>
            <Asset icon={<LogoEth />} label='ETH' />
            <LabelValue label='Expiry Date' value='10Nov23' hasDropdown={true} />
            <LabelValue
                label='Next Auction'
                value={<CountdownTimer />}
            />
            <LabelValue label='Last Auction Price' value='1,807.28' subValue='10Oct23 13:23' />
        </Flex>
    );
};

export default TradingControls;

