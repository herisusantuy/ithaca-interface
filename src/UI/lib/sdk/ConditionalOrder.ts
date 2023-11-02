import { StrategyType } from './StrategyType'

export interface ConditionalOrder {
    clientOrderId: number
    orderType: string
    timeInForce: string
    totalNetPrice: number
    clientEthAddress: string
    orderGenesis?: string
    legs: Leg[]
    fwdPrice?: number
    spotPrice?: number
    addCollateral?: boolean
    numeraireY?: boolean
}

export interface Leg {
    contractId: number
    side: string
    quantity: number
}

/**
 * SignedConditionalOrder has different data types for some of the properties then ConditionalOrder
 * totalNetPrice and quantity in Leg are number type in ConditionalOrder but string in SignedConditionalOrder
 *
 * we are using string data type as we need to maintain fix decimal point precision for those values. which is difficult to achieve with number data type.
 */
export interface SignedConditionalOrder {
    clientOrderId: number
    orderType: string
    timeInForce: string
    orderGenesis?: string
    clientEthAddress: string
    signature: string
    totalNetPrice: string
    legs: Leg[]
    fwdPrice?: number
    spotPrice?: number
    orderDescr?: string
}

export interface PortfolioOrder {
    type: string
    expiry: number
    currencyPair: string
    collateralCurrency?: string
    isBorrowed?: boolean
    earn?: number
    pay?: number
    tunePrice?: number
    lendAmount?: string
    borrowAmount?: string
    ethAddress: string
    netPrice: number
    orderGenesis?: string
    legs: PortfolioLeg[]
    fwdPrice?: number
    spotPrice?: number
    addCollateral?: boolean
    numeraireY?: boolean
}

export interface PortfolioLegCreator extends PortfolioLeg {
    type: StrategyType
    typeButtons: {
        value: string
        label: string
    }[]
    index?: number
}

export interface PortfolioLeg {
    contractId: number
    side: string
    quantity: number
    product?: string
    referencePrice?: number
}
