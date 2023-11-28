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
    strike: number,
    linked: boolean
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
                "strike": 0,
                "linked": true
            },
            {
                "product": "digital-option",
                "type": "BinaryCall",
                "side": "SELL",
                "size": 1,
                "strike": 2,
                "linked": true
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
                "strike": 0,
                "linked": true
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
                "strike": 0,
                "linked": true
            },
            {
                "product": "digital-option",
                "type": "BinaryCall",
                "side": "SELL",
                "size": 1,
                "strike": 0,
                "linked": true
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
                "strike": 0,
                "linked": true
            },
            {
                "product": "digital-option",
                "type": "BinaryCall",
                "side": "BUY",
                "size": 200,
                "strike": 0,
                "linked": true
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
                "strike": -2,
                "linked": true
            },
            {
                "product": "option",
                "type": "Call",
                "side": "SELL",
                "size": 1,
                "strike": 0,
                "linked": true
            },
            {
                "product": "digital-option",
                "type": "BinaryCall",
                "side": "SELL",
                "size": 200,
                "strike": 0,
                "linked": true
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
                "strike": -3,
                "linked": true
            },
            {
                "product": "digital-option",
                "type": "BinaryPut",
                "side": "BUY",
                "size": 200,
                "strike": -3,
                "linked": true
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
                "strike": -1,
                "linked": true
            },
            {
                "product": "option",
                "type": "Put",
                "side": "SELL",
                "size": 1,
                "strike": -3,
                "linked": true
            },
            {
                "product": "digital-option",
                "type": "BinaryPut",
                "side": "SELL",
                "size": 200,
                "strike": -3,
                "linked": true
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
                "strike": -1,
                "linked": true
            },
            {
                "product": "option",
                "type": "Put",
                "side": "SELL",
                "size": 1,
                "strike": -3,
                "linked": true
            },
            {
                "product": "digital-option",
                "type": "BinaryPut",
                "side": "SELL",
                "size": 200,
                "strike": -3,
                "linked": true
            },
            {
                "product": "Forward",
                "type": "CURRENT",
                "side": "BUY",
                "size": 1,
                "strike": -1,
                "linked": true
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
                "strike": -1,
                "linked": true
            },
            {
                "product": "option",
                "type": "Put",
                "side": "SELL",
                "size": 2,
                "strike": -3,
                "linked": true
            },
            {
                "product": "digital-option",
                "type": "BinaryPut",
                "side": "SELL",
                "size": 400,
                "strike": -3,
                "linked": true
            },
            {
                "product": "Forward",
                "type": "CURRENT",
                "side": "BUY",
                "size": 1,
                "strike": -1,
                "linked": true
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
                "strike": 0,
                "linked": true
            },
            {
                "product": "option",
                "type": "Put",
                "side": "BUY",
                "size": 1,
                "strike": 0,
                "linked": true
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
                "strike": 1,
                "linked": true
            },
            {
                "product": "option",
                "type": "Put",
                "side": "BUY",
                "size": 1,
                "strike": -1,
                "linked": true
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
                "strike": 1,
                "linked": true
            },
            {
                "product": "option",
                "type": "Call",
                "side": "SELL",
                "size": 1,
                "strike": 2,
                "linked": true
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
                "strike": 0,
                "linked": true
            },
            {
                "product": "option",
                "type": "Put",
                "side": "SELL",
                "size": 1,
                "strike": 0,
                "linked": true
            }
        ]
    }
];