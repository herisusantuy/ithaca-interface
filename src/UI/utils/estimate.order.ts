import { PortfolioLeg, PortfolioOrder, ConditionalOrder } from '../lib/sdk/ConditionalOrder'
import { zeroAddress } from 'ethereumjs-util'
import { StrategyType } from '../lib/sdk/StrategyType'

// export const estimateOrder = (
//     strategyType: StrategyType,
//     legs: PortfolioLeg[],
//     netPrice: number,
//     numeraireY = true,
//     addCollateral = false
// ) => {
//     const appState = store.getState()
//     const tenor = appState.appReducer.tenor
//     const currencyPair = appState.appReducer.currencyPair
//     //TODO: Remove in production
//     const ethAddress = appState.authReducer.client?.ethAddress || zeroAddress()
//     if (!tenor || !currencyPair || !ethAddress) return

//     const order: PortfolioOrder = {
//         type: strategyType,
//         expiry: tenor,
//         currencyPair,
//         ethAddress,
//         netPrice,
//         orderGenesis: 'CLIENT_PREDEFINED',
//         legs,
//     }

//     store.dispatch(setPortfolioOrder({ type: strategyType, data: order }))
//     store.dispatch(getEstimateOrderLockAsync(order))
//     store.dispatch(getEstimateOrderPayoffAsync({ ...order, numeraireY, addCollateral }))
// }


export const createClientOrderId = (value: number = 101): number => {
    const date = Date.now()

    /***
     * '<<' left shift operator convert number to 32 bit.
     * here, used Arithmetic shifts. to deal with 64 bit number
     * */
    return date * Math.pow(2, 10) + value
}


export const estimateOrderSingleLeg = (
    strategyType: string,
    leg: PortfolioLeg[],
    netPrice: number,
    expiry: number,
    // numeraireY = true,
    // addCollateral = false
) => {
    const currencyPair = 'WETH/USDC'
    //TODO: Remove in production
    const ethAddress = zeroAddress()
    if (!expiry || !currencyPair || !ethAddress) return

    const order: PortfolioOrder = {
        type: strategyType,
        expiry,
        currencyPair,
        ethAddress,
        netPrice,
        orderGenesis: 'CLIENT_PREDEFINED',
        legs: leg,
        fwdPrice: strategyType === StrategyType.STRATEGY_FORWARD ? leg[leg.length -1].referencePrice : undefined,
    }
    return createConditionalOrder(order);
}

const createConditionalOrder = (portfolioOrder: PortfolioOrder): ConditionalOrder => {
    const { ethAddress, legs, netPrice, orderGenesis, fwdPrice, spotPrice, addCollateral, numeraireY } = portfolioOrder
    return {
        orderType: 'LIMIT',
        timeInForce: 'GOOD_TILL_CANCEL',
        clientEthAddress: ethAddress,
        clientOrderId: createClientOrderId(),
        totalNetPrice: netPrice,
        orderGenesis: orderGenesis,
        fwdPrice,
        spotPrice,
        legs: legs.map((leg) => ({
            contractId: leg.contractId,
            quantity: leg.quantity,
            side: leg.side,
        })),
        numeraireY,
        addCollateral,
    }
}