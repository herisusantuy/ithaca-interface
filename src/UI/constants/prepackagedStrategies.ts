export type PrepackagedStrategy = {
    label: string,
    key: string,
    strategies: StrategyLeg[]
}

export type StrategyLeg = {
    product: string,
    type: string,
    side: 'BUY' | 'SELL',
    size: number,
    strike: number
}

export const STRATEGIES: PrepackagedStrategy[] = [
    {
        "label": "Bet",
        "key": "bet",
        "strategies": [
            {
                "product": "digital-option",
                "type": "BinaryCall",
                "side": "BUY",
                "size": 1,
                "strike": 0
            },
            {
                "product": "digital-option",
                "type": "BinaryCall",
                "side": "SELL",
                "size": 1,
                "strike": 2
            }
        ]
    },
    {
        "label": "Earn",
        "key": "earn",
        "strategies": [
            {
                "product": "option",
                "type": "Put",
                "side": "SELL",
                "size": 1,
                "strike": 0
            }
        ]
    },
    {
        "label": "No Gain no Pain",
        "key": "no-gain-no-pain",
        "strategies": [
            {
                "product": "option",
                "type": "Call",
                "side": "BUY",
                "size": 1,
                "strike": 0
            },
            {
                "product": "digital-option",
                "type": "BinaryCall",
                "side": "SELL",
                "size": 1,
                "strike": 0
            }
        ]
    },
    {
        "label": "Up n In Call",
        "key": "up-n-in-call",
        "strategies": [
            {
                "product": "option",
                "type": "Call",
                "side": "BUY",
                "size": 1,
                "strike": 0
            },
            {
                "product": "digital-option",
                "type": "BinaryCall",
                "side": "BUY",
                "size": 200,
                "strike": 0
            }
        ]
    },
    {
        "label": "Up n Out Call",
        "key": "up-n-out-call",
        "strategies": [
            {
                "product": "option",
                "type": "Call",
                "side": "BUY",
                "size": 1,
                "strike": -2
            },
            {
                "product": "option",
                "type": "Call",
                "side": "SELL",
                "size": 1,
                "strike": 0
            },
            {
                "product": "digital-option",
                "type": "BinaryCall",
                "side": "SELL",
                "size": 200,
                "strike": 0
            }
        ]
    },
    {
        "label": "Down In Put",
        "key": "down-in-put",
        "strategies": [
            {
                "product": "option",
                "type": "Put",
                "side": "BUY",
                "size": 1,
                "strike": -3
            },
            {
                "product": "digital-option",
                "type": "BinaryPut",
                "side": "BUY",
                "size": 200,
                "strike": -3
            }
        ]
    },
    {
        "label": "Down Out Put",
        "key": "down-out-put",
        "strategies": [
            {
                "product": "option",
                "type": "Put",
                "side": "BUY",
                "size": 1,
                "strike": -1
            },
            {
                "product": "option",
                "type": "Put",
                "side": "SELL",
                "size": 1,
                "strike": -3
            },
            {
                "product": "digital-option",
                "type": "BinaryPut",
                "side": "SELL",
                "size": 200,
                "strike": -3
            }
        ]
    },
    {
        "label": "Bonus",
        "key": "bonus",
        "strategies": [
            {
                "product": "option",
                "type": "Put",
                "side": "BUY",
                "size": 1,
                "strike": -1
            },
            {
                "product": "option",
                "type": "Put",
                "side": "SELL",
                "size": 1,
                "strike": -3
            },
            {
                "product": "digital-option",
                "type": "BinaryPut",
                "side": "SELL",
                "size": 200,
                "strike": -3
            },
            {
                "product": "Forward",
                "type": "CURRENT",
                "side": "BUY",
                "size": 1,
                "strike": -1
            }
        ]
    },
    {
        "label": "Twin Win",
        "key": "twin-win",
        "strategies": [
            {
                "product": "option",
                "type": "Put",
                "side": "BUY",
                "size": 2,
                "strike": -1
            },
            {
                "product": "option",
                "type": "Put",
                "side": "SELL",
                "size": 2,
                "strike": -3
            },
            {
                "product": "digital-option",
                "type": "BinaryPut",
                "side": "SELL",
                "size": 400,
                "strike": -3
            },
            {
                "product": "Forward",
                "type": "CURRENT",
                "side": "BUY",
                "size": 1,
                "strike": -1
            }
        ]
    },{
        "label": "Straddle",
        "key": "straddle",
        "strategies": [
            {
                "product": "option",
                "type": "Call",
                "side": "BUY",
                "size": 1,
                "strike": 0
            },
            {
                "product": "option",
                "type": "Put",
                "side": "BUY",
                "size": 1,
                "strike": 0
            }

        ]
    },
    {
        "label": "Strangle",
        "key": "strangle",
        "strategies": [
            {
                "product": "option",
                "type": "Call",
                "side": "BUY",
                "size": 1,
                "strike": 1
            },
            {
                "product": "option",
                "type": "Put",
                "side": "BUY",
                "size": 1,
                "strike": -1
            }

        ]
    },
    {
        "label": "Call Spread",
        "key": "call-spread",
        "strategies": [
            {
                "product": "option",
                "type": "Call",
                "side": "BUY",
                "size": 1,
                "strike": 1
            },
            {
                "product": "option",
                "type": "Call",
                "side": "SELL",
                "size": 1,
                "strike": 2
            }
        ]
    },
    {
        "label": "Butterfly",
        "key": "butterfly",
        "strategies": [
            {
                "product": "option",
                "type": "Call",
                "side": "SELL",
                "size": 1,
                "strike": 0
            },
            {
                "product": "option",
                "type": "Put",
                "side": "SELL",
                "size": 1,
                "strike": 0
            }
        ]
    }
];